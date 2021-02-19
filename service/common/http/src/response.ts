import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

/** Type to represent HTTP headers */
export type Headers = { [header: string]: boolean | number | string };

/**
 * Interface that anything able to be a response should implement
 */
export interface Respondable<T> {
  /** Determine the status code for the response */
  statusCode(): number;
  /** Determine the headers for the response */
  headers(): Headers;
  /** Determine the body of the response */
  body(): T;
}

/**
 * Representation of a response from an API Gateway call
 */
export class Response<T> implements APIGatewayProxyStructuredResultV2 {
  /** The status code of the response */
  readonly statusCode: number;
  /** The headers of the response */
  readonly headers: Headers;
  /** The body of the response */
  readonly body: string;

  /**
   * Construct the response
   * @param respondable The respondable that represents the response details
   */
  constructor(respondable: Respondable<T>) {
    this.statusCode = respondable.statusCode();
    this.headers = respondable.headers();
    this.body = JSON.stringify(respondable.body());
  }
}
