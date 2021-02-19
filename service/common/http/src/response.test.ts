import { Response } from './response';

describe('Simple Response', () => {
  const response = new Response({
    statusCode: () => 422,
    headers: () => ({}),
    body: () => ({}),
  });

  test('statusCode', () => {
    expect(response.statusCode).toBe(422);
  });
  test('headers', () => {
    expect(response.headers).toEqual({});
  });
  test('body', () => {
    expect(JSON.parse(response.body)).toEqual({});
  });
});

describe('Response with headers', () => {
  const response = new Response({
    statusCode: () => 422,
    headers: () => ({
      'cache-control': 'no-cache',
      etag: '"abc"',
    }),
    body: () => ({}),
  });

  test('statusCode', () => {
    expect(response.statusCode).toBe(422);
  });
  test('headers', () => {
    expect(response.headers).toEqual({
      'cache-control': 'no-cache',
      etag: '"abc"',
    });
  });
  test('body', () => {
    expect(JSON.parse(response.body)).toEqual({});
  });
});

describe('With body', () => {
  const response = new Response({
    statusCode: () => 422,
    headers: () => ({}),
    body: () => ({
      answer: 42,
      hello: 'world',
    }),
  });

  test('statusCode', () => {
    expect(response.statusCode).toBe(422);
  });
  test('headers', () => {
    expect(response.headers).toEqual({});
  });
  test('body', () => {
    expect(JSON.parse(response.body)).toEqual({
      answer: 42,
      hello: 'world',
    });
  });
});
