import { Problem } from './problem';

/**
 * Create a new problem for an HTTP 404 Not Found
 */
export function NOT_FOUND_PROBLEM(): Problem {
  return new Problem(404);
}
