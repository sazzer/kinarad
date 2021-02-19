import { ProblemRespose } from './response';
import { ProblemType } from './types';
import { Response } from '../response';

/**
 * Representation of a Problem Details.
 */
export class Problem {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private values: Record<string, any>;

  /**
   * Construct a problem
   * @param status The status code
   * @param type The type
   * @param title The title
   */
  constructor(status: number, type?: string, title?: string) {
    this.status = status;
    this.type = type ?? 'about:blank';
    this.title = title;
    this.values = {};
  }

  /**
   * Construct a new problem from some provided problem type details.
   * @param problemType The problem type to construct from
   */
  static fromProblemType(problemType: ProblemType): Problem {
    return new Problem(problemType.status, problemType.type, problemType.title);
  }

  /**
   * Provide a new value for the detail
   * @param detail The new detail to use
   */
  withDetail(detail: string): Problem {
    this.detail = detail;
    return this;
  }

  /**
   * Provide a new value for the instance
   * @param instance The new instance to use
   */
  withInstance(instance: string): Problem {
    this.instance = instance;
    return this;
  }

  /**
   * Provide a new value
   * @param key The key for the new value
   * @param value The new value
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  withValue(key: string, value: any): Problem {
    this.values[key] = value;
    return this;
  }

  /**
   * Actually generate the response for the client
   * @param input The input request
   * @returns The output response
   */
  response(): Response {
    const problemBody = {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.detail,
      instance: this.instance,
      ...this.values,
    };

    return new ProblemRespose(this.status, problemBody);
  }
}
