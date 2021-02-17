import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

import { Responder } from '../response';

/**
 * Representation of a Problem Details response.
 */
export class Problem implements Responder {
  /** The type value */
  private readonly type: string;
  /** The title value */
  private readonly title: string | undefined;
  /** The status code */
  private readonly status: number;
  /** The detail value */
  private detail: string | undefined;
  /** The instance value */
  private instance: string | undefined;
  /** Any additional values */
  private values: Record<string, any>;

  /**
   * Construct a problem
   * @param type The type
   * @param title The title
   * @param status The status code
   */
  constructor(type: string, title?: string, status?: number) {
    this.type = type;
    this.title = title;
    this.status = status ?? 400;
    this.values = {};
  }

  /**
   * Actually generate the response for the client
   * @param input The input request
   * @returns The output response
   */
  response(input: APIGatewayProxyEventV2): APIGatewayProxyResultV2 {
    const problemBody = {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.detail,
      instance: this.instance,
      ...this.values,
    };

    return {
      statusCode: this.status,
      body: JSON.stringify(problemBody),
      headers: {
        'content-type': 'application/problem+json',
        'cache-control': 'no-cache',
      },
    };
  }
}
