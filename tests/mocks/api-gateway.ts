import { APIGatewayProxyEvent } from "aws-lambda";

export const request = (data: any, method = "GET", pathParameters = {}) =>
  ({
    body: data ? JSON.stringify(data) : null,
    httpMethod: method,
    headers: {},
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters,
    requestContext: {} as any,
    resource: "",
    path: "",
    stageVariables: null,
    isBase64Encoded: false,
  }) as APIGatewayProxyEvent;
