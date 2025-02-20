import { ZodError, ZodIssue } from "zod";

export class ValidationRequestError extends Error {
  private errors: ZodError | null;

  constructor(errors: ZodError | null, message?: string) {
    super(message ?? "Validation failed.");
    this.name = "ValidationRequestError";
    this.stack = (<any>new Error()).stack;
    this.errors = errors;
  }

  getErrors() {
    return this.errors?.issues?.map((issue: ZodIssue) => ({
      field: issue.path.join("."),
      message: issue.message,
      errorCode: issue.code,
    }));
  }
}
