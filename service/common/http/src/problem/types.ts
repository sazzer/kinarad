import { Problem } from './problem';

/**
 * Representation of the type of a problem, to easily generate problems.
 */
export class ProblemType {
  /** The type value */
  private readonly type: string | undefined;
  /** The title value */
  private readonly title: string | undefined;
  /** The status code */
  private readonly status: number;

  /**
   * Construct a problem
   * @param status The status code
   * @param type The type
   * @param title The title
   */
  constructor(status: number, type?: string, title?: string) {
    this.status = status;
    this.type = type;
    this.title = title;
  }

  /**
   * Generate a Problem from this Problem Type
   */
  toProblem(): Problem {
    return new Problem(this.status, this.type, this.title);
  }
}

/** Problem Type representing that a resource wasn't found */
export const NOT_FOUND_PROBLEM_TYPE = new ProblemType(404);
