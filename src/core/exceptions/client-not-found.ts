export class ClientNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? "Client not found.");
    this.name = "ClientNotFoundError";
    this.stack = (<any>new Error()).stack;
  }
}
