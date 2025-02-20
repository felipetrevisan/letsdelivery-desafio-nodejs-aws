export class RequiredPathParamError extends Error {
  constructor(message?: string) {
    super(message ?? "Path Param is required.");
    this.name = "RequiredPathParamError";
    this.stack = (<any>new Error()).stack;
  }
}
