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
 * Base class for responsables that can have their status and headers defined.
 */
export abstract class AbstractRespondable<T> implements Respondable<T> {
  private _status = 200;
  private _headers: Headers = {};

  statusCode(): number {
    return this._status;
  }

  headers(): Headers {
    return this._headers;
  }

  abstract body(): T;

  /**
   * Specify a new status code
   * @param status The status code
   */
  withStatusCode(status: number): this {
    this._status = status;
    return this;
  }

  /**
   * Specify a new header
   * @param name The header name
   * @param value The header value
   */
  withHeader(name: string, value: boolean | number | string): this {
    this._headers[name] = value;
    return this;
  }
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
