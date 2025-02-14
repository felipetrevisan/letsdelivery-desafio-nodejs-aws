import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ZodIssue } from "zod";
import { HttpResponse } from "../../core/http/response";
import { ClientRequestUpdateBody } from "../../core/types/request";
import { UpdateClientUseCase } from "../../core/usecases/update-client-usecase";
import { ClientNotFoundError } from "../../core/exceptions/client-not-found";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return HttpResponse(400, { success: false, message: "Client ID is required" });
    }

    if (!event.body) {
      return HttpResponse(400, { success: false, message: "Request body is required" });
    }

    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch {
      return HttpResponse(400, { success: false, message: "Invalid JSON format" });
    }

    const { data, error } = ClientRequestUpdateBody.safeParse(requestBody);

    if (error) {
      return HttpResponse(422, {
        success: false,
        message: "Validation failed",
        errors: error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      });
    }

    const updateClient = new UpdateClientUseCase();
    const client = await updateClient.execute(id, data);

    return HttpResponse(204, client);
  } catch (error) {
    if (error instanceof ClientNotFoundError) {
      return HttpResponse(404, { success: false, message: error.message });
    }

    return HttpResponse(500, { success: false, message: "Internal server error" });
  }
};
