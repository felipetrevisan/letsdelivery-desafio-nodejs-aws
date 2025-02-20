export class InvalidRequestBodyError extends Error {
  constructor(message?: string) {
    super(message ?? "Request body is required.");
    this.name = "InvalidRequestBodyError";
    this.stack = (<any>new Error()).stack;
  }
}
