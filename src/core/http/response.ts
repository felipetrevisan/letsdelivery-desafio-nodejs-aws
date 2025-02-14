import { APIGatewayProxyResult } from "aws-lambda";

export const HttpResponse = (statusCode: number, body?: any): APIGatewayProxyResult => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: body ? JSON.stringify(body) : "",
});
