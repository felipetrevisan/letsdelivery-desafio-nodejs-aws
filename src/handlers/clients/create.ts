import { randomUUID } from "node:crypto";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpResponse } from "../../core/http/response";
import { ClientRequestCreateBody } from "../../core/types/request";
import { CreateClientUseCase } from "../../core/usecases/create-client-usecase";
import { InvalidRequestBodyError } from "../../core/exceptions/invalid-request-body";
import { ValidationRequestError } from "../../core/exceptions/validation-request";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new InvalidRequestBodyError();
    }

    const requestBody = JSON.parse(event.body);
    const { data, error } = ClientRequestCreateBody.safeParse(requestBody);

    if (error) {
      throw new ValidationRequestError(error);
    }

    const created = new CreateClientUseCase();
    const client = await created.execute({ ...data, id: randomUUID() });

    return HttpResponse(201, client);
  } catch (error) {
    if (error instanceof InvalidRequestBodyError) {
      return HttpResponse(400, { success: false, message: error.message });
    }

    if (error instanceof ValidationRequestError) {
      return HttpResponse(422, { success: false, message: error.message, errors: error.getErrors() });
    }

    return HttpResponse(500, {
      success: false,
      message: "Internal server error",
    });
  }
};
