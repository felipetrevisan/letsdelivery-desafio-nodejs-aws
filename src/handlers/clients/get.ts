import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpResponse } from "../../core/http/response";
import { GetClientUseCase } from "../../core/usecases/get-client-usecase";
import { ClientNotFoundError } from "../../core/exceptions/client-not-found";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const clients = new GetClientUseCase();
    const id = event.pathParameters?.id;

    if (!id) {
      const allClients = await clients.execute();
      
      return HttpResponse(200, allClients);
    }

    const client = await clients.execute(id);

    return HttpResponse(200, client);
  } catch (error) {
    if (error instanceof ClientNotFoundError) {
      return HttpResponse(404, { success: false, message: error.message });
    }

    return HttpResponse(500, { success: false, message: "Internal server error" });
  }
};
