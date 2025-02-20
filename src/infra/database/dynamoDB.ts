import AWS from "aws-sdk";

export const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "sa-east-1",
  ...(process.env.IS_OFFLINE && { endpoint: "http://localhost:8000" }),
});

export class DynamoDBClient<T extends { id: string }> {
  private tableName: string;

  constructor(tableName?: string) {
    this.tableName = tableName || process.env.DYNAMODB_TABLE || "";
  }

  async save(data: T): Promise<void> {
    if (!data.id) throw new Error("ID is required to save on DynamoDB");

    await dynamoDb
      .put({
        TableName: this.tableName,
        Item: data,
      })
      .promise();
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    if (Object.keys(data).length === 0) {
      throw new Error("No fields provided to update on DynamoDB");
    }

    const updateExpressions = Object.keys(data)
      .map((key) => `#${key} = :${key}`)
      .join(", ");

    const expressionAttributeNames = Object.keys(data).reduce(
      (acc, key) => ({ ...acc, [`#${key}`]: key }),
      {}
    );

    const expressionAttributeValues = Object.keys(data).reduce(
      (acc, key) => ({ ...acc, [`:${key}`]: (data as any)[key] }),
      {}
    );

    const result = await dynamoDb
      .update({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `set ${updateExpressions}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return result.Attributes as T;
  }

  async get(id: string): Promise<T | null> {
    const result = await dynamoDb
      .get({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();

    return result.Item ? (result.Item as T) : null;
  }

  async getAll(): Promise<T[]> {
    const result = await dynamoDb
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return result.Items ? (result.Items as T[]) : [];
  }

  async delete(id: string): Promise<void> {
    await dynamoDb
      .delete({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();
  }

  async emptyDatabase(): Promise<void> {
    const results = await this.getAll();

    if (results.length) {
      for (const item of results) {
        await this.delete(item.id);
      }
    }
  }
}
