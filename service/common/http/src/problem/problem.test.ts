import { Problem } from './problem';

describe('Respondable', () => {
  describe('Empty Problem', () => {
    const problem = new Problem(400);

    test('statusCode', () => {
      expect(problem.statusCode()).toBe(400);
    });

    test('headers', () => {
      expect(problem.headers()).toEqual({
        'content-type': 'application/problem+json',
        'cache-control': 'no-cache',
      });
    });

    test('body', () => {
      expect(problem.body()).toEqual({
        status: 400,
      });
    });
  });

  describe('Simple Problem', () => {
    const problem = new Problem(409, 'some-type', 'Some Title');

    test('statusCode', () => {
      expect(problem.statusCode()).toBe(409);
    });

    test('headers', () => {
      expect(problem.headers()).toEqual({
        'content-type': 'application/problem+json',
        'cache-control': 'no-cache',
      });
    });

    test('body', () => {
      expect(problem.body()).toEqual({
        status: 409,
        type: 'some-type',
        title: 'Some Title',
      });
    });
  });
});
