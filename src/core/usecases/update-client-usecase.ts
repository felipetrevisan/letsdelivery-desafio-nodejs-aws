import { DynamoDBClient } from "../../infra/database/dynamoDB";
import { Client } from "../types/client";

export class UpdateClientUseCase {
  private db = new DynamoDBClient<Client>();

  async execute(id: string, data: Partial<Client>): Promise<Client> {
    const updatedData = await this.db.update(id, data);

    return updatedData;
  }
}
