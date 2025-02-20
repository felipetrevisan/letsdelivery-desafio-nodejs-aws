import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpResponse } from "../../core/http/response";
import { DeleteClientUseCase } from "../../core/usecases/delete-client-usecase";
import { ClientNotFoundError } from "../../core/exceptions/client-not-found";
import { RequiredPathParamError } from "../../core/exceptions/path-param-required";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      throw new RequiredPathParamError("Client ID is required");
    }

    await new DeleteClientUseCase().execute(id);

    return HttpResponse(204, null);
  } catch (error) {
    if (error instanceof ClientNotFoundError) {
      return HttpResponse(404, { success: false, message: error.message });
    }

    if (error instanceof RequiredPathParamError) {
      return HttpResponse(400, { success: false, message: error.message });
    }

    return HttpResponse(500, { success: false, message: "Internal server error" });
  }
};
