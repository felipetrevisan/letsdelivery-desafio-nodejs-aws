import { DynamoDBClient } from "../../infra/database/dynamoDB";
import { Client } from "../types/client";

export class CreateClientUseCase {
  private db = new DynamoDBClient<Client>();

  async execute(data: Client): Promise<Client> {
    await this.db.save(data);

    return data;
  }
}