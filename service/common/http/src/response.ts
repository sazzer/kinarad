import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

/**
 * Interface that eveything able to generate an HTTP response should implement
 */
export interface Responder {
  /**
   * Actually generate the response for the client
   * @param input The input request
   * @returns The output response
   */
  response: (input: APIGatewayProxyEventV2) => APIGatewayProxyStructuredResultV2;
}
