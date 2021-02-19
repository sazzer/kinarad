/**
 * Representation of the type of a problem, to easily generate problems.
 */
export class ProblemType {
  /** The type value */
  readonly type: string | undefined;
  /** The title value */
  readonly title: string | undefined;
  /** The status code */
  readonly status: number;

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
}

/** Problem Type representing that a resource wasn't found */
export const NOT_FOUND_PROBLEM_TYPE = new ProblemType(404);
