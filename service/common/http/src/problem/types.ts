import { Problem } from './problem';

/**
 * Representation of the type of a problem, to easily generate problems.
 */
export class ProblemType {
  /** The type value */
  private readonly type: string;
  /** The title value */
  private readonly title: string | undefined;
  /** The status code */
  private readonly status: number | undefined;

  /**
   * Construct a problem
   * @param type The type
   * @param title The title
   * @param status The status code
   */
  constructor(type: string, title?: string, status?: number) {
    this.type = type;
    this.title = title;
    this.status = status;
  }

  /**
   * Generate a Problem from this Problem Type
   */
  toProblem(): Problem {
    return new Problem(this.type, this.title, this.status);
  }
}

/** Problem Type representing that a resource wasn't found */
export const NOT_FOUND_PROBLEM_TYPE = new ProblemType('about:blank', undefined, 404);
