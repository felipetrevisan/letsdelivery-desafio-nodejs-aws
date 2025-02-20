import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpResponse } from "../../core/http/response";
import { ClientRequestUpdateBody } from "../../core/types/request";
import { UpdateClientUseCase } from "../../core/usecases/update-client-usecase";
import { ClientNotFoundError } from "../../core/exceptions/client-not-found";
import { InvalidRequestBodyError } from "../../core/exceptions/invalid-request-body";
import { ValidationRequestError } from "../../core/exceptions/validation-request";
import { RequiredPathParamError } from "../../core/exceptions/path-param-required";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      throw new RequiredPathParamError("Client ID is required");
    }

    if (!event.body) {
      throw new InvalidRequestBodyError();
    }

    let requestBody;

    try {
      requestBody = JSON.parse(event.body);
    } catch {
      return HttpResponse(400, { success: false, message: "Invalid JSON format" });
    }

    const { data, error } = ClientRequestUpdateBody.safeParse(requestBody);

    if (error) {
      throw new ValidationRequestError(error);
    }

    const updateClient = new UpdateClientUseCase();
    const client = await updateClient.execute(id, data);

    return HttpResponse(204, client);
  } catch (error) {
    if (error instanceof ClientNotFoundError) {
      return HttpResponse(404, { success: false, message: error.message });
    }

    if (error instanceof RequiredPathParamError) {
      return HttpResponse(400, { success: false, message: error.message });
    }

    if (error instanceof InvalidRequestBodyError) {
      return HttpResponse(400, { success: false, message: error.message });
    }

    if (error instanceof ValidationRequestError) {
      return HttpResponse(422, {
        success: false,
        message: error.message,
        errors: error.getErrors(),
      });
    }

    return HttpResponse(500, { success: false, message: "Internal server error" });
  }
};
