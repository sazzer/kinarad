import { Response } from '../response';
/**
 * Representation of a Response in HAL format
 */
export class HALResponse extends Response {
  /**
   * Construct the respnse
   * @param statusCode The status code
   * @param headers The HTTP headers
   * @param body The body
   */
  constructor(body: any) {
    super(
      200,
      {
        'content-type': 'application/hal+json',
      },
      JSON.stringify(body)
    );
  }
}
