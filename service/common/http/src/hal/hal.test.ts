import { HAL } from './hal';

describe('Empty document', () => {
  const hal = new HAL({});

  test('statusCode', () => {
    expect(hal.statusCode()).toBe(200);
  });

  test('headers', () => {
    expect(hal.headers()).toEqual({
      'content-type': 'application/hal+json',
    });
  });

  test('body', () => {
    expect(hal.body()).toEqual({
      _links: {},
    });
  });
});

describe('Populated document', () => {
  const hal = new HAL({
    answer: 42,
    hello: 'world',
  });

  test('statusCode', () => {
    expect(hal.statusCode()).toBe(200);
  });

  test('headers', () => {
    expect(hal.headers()).toEqual({
      'content-type': 'application/hal+json',
    });
  });

  test('body', () => {
    expect(hal.body()).toEqual({
      _links: {},
      answer: 42,
      hello: 'world',
    });
  });
});

describe('With self link', () => {
  const hal = new HAL({}).withLink('self', { href: 'http://example.com/test/123' });

  test('statusCode', () => {
    expect(hal.statusCode()).toBe(200);
  });

  test('headers', () => {
    expect(hal.headers()).toEqual({
      'content-type': 'application/hal+json',
    });
  });

  test('body', () => {
    expect(hal.body()).toEqual({
      _links: {
        self: {
          href: 'http://example.com/test/123',
        },
      },
    });
  });
});

describe('With item links', () => {
  const hal = new HAL({})
    .withLink('item', { href: 'http://example.com/other/1' })
    .withLink('item', { href: 'http://example.com/other/2' })
    .withLink('item', { href: 'http://example.com/other/3' });

  test('statusCode', () => {
    expect(hal.statusCode()).toBe(200);
  });

  test('headers', () => {
    expect(hal.headers()).toEqual({
      'content-type': 'application/hal+json',
    });
  });

  test('body', () => {
    expect(hal.body()).toEqual({
      _links: {
        item: [
          {
            href: 'http://example.com/other/1',
          },
          {
            href: 'http://example.com/other/2',
          },
          {
            href: 'http://example.com/other/3',
          },
        ],
      },
    });
  });
});

describe('Change status code', () => {
  const hal = new HAL({}).withStatusCode(202);

  test('statusCode', () => {
    expect(hal.statusCode()).toBe(202);
  });

  test('headers', () => {
    expect(hal.headers()).toEqual({
      'content-type': 'application/hal+json',
    });
  });

  test('body', () => {
    expect(hal.body()).toEqual({
      _links: {},
    });
  });
});

describe('With caching headers', () => {
  const hal = new HAL({}).withHeader('cache-control', 'max-age=3600');

  test('statusCode', () => {
    expect(hal.statusCode()).toBe(200);
  });

  test('headers', () => {
    expect(hal.headers()).toEqual({
      'content-type': 'application/hal+json',
      'cache-control': 'max-age=3600',
    });
  });

  test('body', () => {
    expect(hal.body()).toEqual({
      _links: {},
    });
  });
});
