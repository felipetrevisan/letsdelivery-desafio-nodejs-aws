import { DynamoDBClient } from "../../infra/database/dynamoDB";
import { ClientNotFoundError } from "../exceptions/client-not-found";
import { Client } from "../types/client";

export class DeleteClientUseCase {
  private db = new DynamoDBClient<Client>();

  async execute(id: string): Promise<void> {
    const result = await this.db.get(id);

    if (!result) {
      throw new ClientNotFoundError(`Client not found for the provided ID (${id}).`);
    }

    await this.db.delete(id);
  }
}
