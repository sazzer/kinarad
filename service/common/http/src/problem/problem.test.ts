import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Problem } from './problem';

describe('Problem.response()', () => {
  const input = {} as APIGatewayProxyEventV2;
  test('Minimal problem', () => {
    const problem = new Problem(400);

    const response = problem.response(input);
    expect(response.statusCode).toBe(400);
    expect(response.headers).toMatchInlineSnapshot(`
      Object {
        "cache-control": "no-cache",
        "content-type": "application/problem+json",
      }
    `);
    expect(JSON.parse(response.body!)).toMatchInlineSnapshot(`
      Object {
        "status": 400,
        "type": "about:blank",
      }
    `);
  });

  test('Populated problem', () => {
    const problem = new Problem(422, 'tag:kinarad,2021:some/problem', 'Something went wrong');

    const response = problem.response(input);
    expect(response.statusCode).toBe(422);
    expect(response.headers).toMatchInlineSnapshot(`
      Object {
        "cache-control": "no-cache",
        "content-type": "application/problem+json",
      }
    `);
    expect(JSON.parse(response.body!)).toMatchInlineSnapshot(`
      Object {
        "status": 422,
        "title": "Something went wrong",
        "type": "tag:kinarad,2021:some/problem",
      }
    `);
  });

  test('Detail + Instance', () => {
    const problem = new Problem(422, 'tag:kinarad,2021:some/problem', 'Something went wrong')
      .withDetail('someDetail')
      .withInstance('someInstance');

    const response = problem.response(input);
    expect(response.statusCode).toBe(422);
    expect(response.headers).toMatchInlineSnapshot(`
        Object {
          "cache-control": "no-cache",
          "content-type": "application/problem+json",
        }
      `);
    expect(JSON.parse(response.body!)).toMatchInlineSnapshot(`
      Object {
        "detail": "someDetail",
        "instance": "someInstance",
        "status": 422,
        "title": "Something went wrong",
        "type": "tag:kinarad,2021:some/problem",
      }
    `);
  });

  test('Additional values', () => {
    const problem = new Problem(422, 'tag:kinarad,2021:some/problem', 'Something went wrong')
      .withValue('answer', 42)
      .withValue('name', {
        first: 'Graham',
        last: 'Cox',
      });

    const response = problem.response(input);
    expect(response.statusCode).toBe(422);
    expect(response.headers).toMatchInlineSnapshot(`
        Object {
          "cache-control": "no-cache",
          "content-type": "application/problem+json",
        }
      `);
    expect(JSON.parse(response.body!)).toMatchInlineSnapshot(`
      Object {
        "answer": 42,
        "name": Object {
          "first": "Graham",
          "last": "Cox",
        },
        "status": 422,
        "title": "Something went wrong",
        "type": "tag:kinarad,2021:some/problem",
      }
    `);
  });
});
