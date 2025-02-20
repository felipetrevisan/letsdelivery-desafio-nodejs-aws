import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { NativeAttributeValue } from "@aws-sdk/lib-dynamodb";

AWSMock.setSDKInstance(AWS);

export const mockDynamoDB = () => {
  AWSMock.mock(
    "DynamoDB.DocumentClient",
    "put",
    (
      params: DocumentClient.PutItemInput,
      callback: (error: any | null, data?: DocumentClient.PutItemOutput) => void
    ) => {
      callback(null, { Attributes: params.Item });
    }
  );

  AWSMock.mock(
    "DynamoDB.DocumentClient",
    "get",
    (
      params: DocumentClient.GetItemInput,
      callback: (error: any | null, data?: DocumentClient.GetItemOutput) => void
    ) => {
      if (
        params.Key &&
        (params.Key.id as NativeAttributeValue) === "existing-id"
      ) {
        console.log("Existing");
        callback(null, { Item: { id: "existing-id", name: "Test User" } });
      } else {
        callback(null, {});
      }
    }
  );

  AWSMock.mock("DynamoDB.DocumentClient", "scan", (_, callback) => {
    callback(null, {
      Items: [
        { id: "1", name: "User1" },
        { id: "2", name: "User2" },
      ],
    });
  });

  AWSMock.mock("DynamoDB.DocumentClient", "delete", (_, callback) => {
    callback(null, {});
  });
};

export const restoreDynamoDB = () => {
  AWSMock.restore("DynamoDB.DocumentClient");
};
