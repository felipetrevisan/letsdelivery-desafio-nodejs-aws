import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpResponse } from "../../core/http/response";
import { GetAllClientUseCase } from "../../core/usecases/getAll-client-usecase";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const clients = new GetAllClientUseCase();

  const client = await clients.execute();

  return HttpResponse(200, client);
};
