import { Headers } from '../response';
import { Respondable } from '../response';
/**
 * The shape of a Problem Details response
 */
export interface ProblemDetails {
  readonly type?: string;
  readonly title?: string;
  readonly status: number;
  readonly detail?: string;
  readonly instance?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [key: string]: any;
}

/**
 * Problem respondable
 */
export class Problem implements Respondable<ProblemDetails> {
  private type?: string;
  private title?: string;
  private status: number;
  private detail?: string;
  private instance?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private values: { [key: string]: any };

  constructor(status: number, type?: string, title?: string) {
    this.status = status;
    this.type = type;
    this.title = title;
    this.values = {};
  }

  /** Determine the status code for the response */
  statusCode(): number {
    return this.status;
  }

  /** Determine the headers for the response */
  headers(): Headers {
    return {
      'content-type': 'application/problem+json',
      'cache-control': 'no-cache',
    };
  }

  /** Determine the body of the response */
  body(): ProblemDetails {
    return {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.detail,
      instance: this.instance,
      ...this.values,
    };
  }
}
