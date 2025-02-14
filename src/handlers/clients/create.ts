import { randomUUID } from "node:crypto";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ZodIssue } from "zod";
import { HttpResponse } from "../../core/http/response";
import { ClientRequestCreateBody } from "../../core/types/request";
import { CreateClientUseCase } from "../../core/usecases/create-client-usecase";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return HttpResponse(400, { message: "Request body is required" });
    }

    const requestBody = JSON.parse(event.body);
    const { data, error } = ClientRequestCreateBody.safeParse(requestBody);

    if (error) {
      return HttpResponse(422, {
        success: false,
        message: "Validation failed",
        errors: error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join("."),
          message: issue.message,
          errorCode: issue.code,
        })),
      });
    }

    const created = new CreateClientUseCase();
    const client = await created.execute({ ...data, id: randomUUID() });

    return HttpResponse(201, client);
  } catch (err) {
    return HttpResponse(500, {
      success: false,
      message: "Internal server error",
    });
  }
};
