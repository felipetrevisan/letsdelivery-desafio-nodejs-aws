import { DynamoDBClient } from "../../infra/database/dynamoDB";
import { ClientNotFoundError } from "../exceptions/client-not-found";
import { Client } from "../types/client";

export class UpdateClientUseCase {
  private db = new DynamoDBClient<Client>();

  async execute(id: string, data: Partial<Client>): Promise<Client> {
    const result = await this.db.get(id);

    if (!result) {
      throw new ClientNotFoundError(`Client not found for the provided ID (${id}).`);
    }
    
    const updatedData = await this.db.update(id, data);

    return updatedData;
  }
}
