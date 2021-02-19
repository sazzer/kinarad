import { Response } from '../response';

/**
 * Response representation for Problem Details
 */
export class ProblemRespose extends Response {
  /**
   *
   * @param statusCode The status code
   * @param body The prob
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(statusCode: number, body: Record<string, any>) {
    super(
      statusCode,
      {
        'content-type': 'application/problem+json',
        'cache-control': 'no-cache',
      },
      JSON.stringify(body)
    );
  }
}
