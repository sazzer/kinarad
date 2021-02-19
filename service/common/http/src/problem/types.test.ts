import { NOT_FOUND_PROBLEM } from './types';

describe('NOT_FOUND_PROBLEM', () => {
  const problem = NOT_FOUND_PROBLEM();

  test('statusCode', () => {
    expect(problem.statusCode()).toBe(404);
  });

  test('headers', () => {
    expect(problem.headers()).toEqual({
      'content-type': 'application/problem+json',
      'cache-control': 'no-cache',
    });
  });

  test('body', () => {
    expect(problem.body()).toEqual({
      status: 404,
    });
  });
});
