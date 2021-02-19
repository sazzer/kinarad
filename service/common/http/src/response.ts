import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

/** Type to represent HTTP headers */
export type Headers = { [header: string]: boolean | number | string };

/**
 * Representation of a response from an API Gateway call.
 */
export class Response implements APIGatewayProxyStructuredResultV2 {
  /** The HTTP Status code */
  readonly statusCode: number;
  /** The set of headers */
  readonly headers: Headers;
  /** The response body */
  readonly body?: string;

  /**
   * Construct the response
   * @param statusCode The status code
   * @param headers The HTTP headers
   * @param body The body
   */
  constructor(statusCode: number, headers: Headers, body?: string) {
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = body;
  }
}
