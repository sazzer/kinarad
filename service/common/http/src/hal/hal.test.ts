import { HAL } from './hal';

describe('HAL.response()', () => {
  test('Empty document', () => {
    const hal = new HAL({});
    const response = hal.response();

    expect(response.statusCode).toBe(200);
    expect(response.headers).toMatchInlineSnapshot(`
      Object {
        "content-type": "application/hal+json",
      }
    `);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(JSON.parse(response.body!)).toMatchInlineSnapshot(`
      Object {
        "_links": Object {},
      }
    `);
  });

  test('With body', () => {
    const hal = new HAL({ answer: 42, hello: 'world' });
    const response = hal.response();

    expect(response.statusCode).toBe(200);
    expect(response.headers).toMatchInlineSnapshot(`
      Object {
        "content-type": "application/hal+json",
      }
    `);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(JSON.parse(response.body!)).toMatchInlineSnapshot(`
      Object {
        "_links": Object {},
        "answer": 42,
        "hello": "world",
      }
    `);
  });

  test('With self link', () => {
    const hal = new HAL({}).withLink('self', { href: 'http://example.com/res/1' });
    const response = hal.response();

    expect(response.statusCode).toBe(200);
    expect(response.headers).toMatchInlineSnapshot(`
      Object {
        "content-type": "application/hal+json",
      }
    `);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(JSON.parse(response.body!)).toMatchInlineSnapshot(`
      Object {
        "_links": Object {
          "self": Object {
            "href": "http://example.com/res/1",
          },
        },
      }
    `);
  });

  test('With repeated links', () => {
    const hal = new HAL({})
      .withLink('item', { href: 'http://example.com/res/1' })
      .withLink('item', { href: 'http://example.com/res/2' })
      .withLink('item', { href: 'http://example.com/res/3' });
    const response = hal.response();

    expect(response.statusCode).toBe(200);
    expect(response.headers).toMatchInlineSnapshot(`
      Object {
        "content-type": "application/hal+json",
      }
    `);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(JSON.parse(response.body!)).toMatchInlineSnapshot(`
      Object {
        "_links": Object {
          "item": Array [
            Object {
              "href": "http://example.com/res/1",
            },
            Object {
              "href": "http://example.com/res/2",
            },
            Object {
              "href": "http://example.com/res/3",
            },
          ],
        },
      }
    `);
  });

  test('With self link and body', () => {
    const hal = new HAL({ answer: 42 }).withLink('self', { href: 'http://example.com/res/1' });
    const response = hal.response();

    expect(response.statusCode).toBe(200);
    expect(response.headers).toMatchInlineSnapshot(`
      Object {
        "content-type": "application/hal+json",
      }
    `);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(JSON.parse(response.body!)).toMatchInlineSnapshot(`
      Object {
        "_links": Object {
          "self": Object {
            "href": "http://example.com/res/1",
          },
        },
        "answer": 42,
      }
    `);
  });
});
