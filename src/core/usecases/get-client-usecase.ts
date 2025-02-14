import { DynamoDBClient } from "../../infra/database/dynamoDB";
import { ClientNotFoundError } from "../exceptions/client-not-found";
import { Client } from "../types/client";

export class GetClientUseCase {
  private db = new DynamoDBClient<Client>();

  async execute(id?: string): Promise<Client | Client[] | null> {
    if (id) {
      const result = await this.db.get(id);

      if (!result) {
        throw new ClientNotFoundError(`Client not found for the provided ID (${id}).`);
      }

      return result;
    }

    return await this.db.getAll();
  }
}
