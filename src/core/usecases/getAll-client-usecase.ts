import { DynamoDBClient } from "../../infra/database/dynamoDB";
import { Client } from "../types/client";

export class GetAllClientUseCase {
  private db = new DynamoDBClient<Client>();

  async execute(): Promise<Client[]> {
    return await this.db.getAll();
  }
}
