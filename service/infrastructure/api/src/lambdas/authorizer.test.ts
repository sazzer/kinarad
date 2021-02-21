import { APIGatewayRequestAuthorizerEvent, APIGatewayRequestAuthorizerEventHeaders } from 'aws-lambda';
import { CLIENT_ID, ISSUER, SUBJECT, buildJwk, buildToken } from '../testUtils';

import { handler } from './authorizer';
import nock from 'nock';

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env.COGNITO_ISSUER = 'https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_h96upvx9t';
  process.env.COGNITO_CLIENTID = 'FB4AC1CB-1D7E-4125-97DC-7A5B947B9543';
});

afterAll(() => {
  process.env = OLD_ENV;
});

test('No headers', async () => {
  nock.disableNetConnect();

  const result = await handler({
    methodArn: 'some-method-arn',
  } as APIGatewayRequestAuthorizerEvent);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "context": Object {
        "claimed": undefined,
      },
      "policyDocument": Object {
        "Statement": Array [
          Object {
            "Action": "execute-api:Invoke",
            "Effect": "Allow",
            "Resource": "some-method-arn",
          },
        ],
        "Version": "2012-10-17",
      },
      "principalId": "",
    }
  `);
});

test('No authorization header', async () => {
  nock.disableNetConnect();

  const result = await handler({
    methodArn: 'some-method-arn',
  } as APIGatewayRequestAuthorizerEvent);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "context": Object {
        "claimed": undefined,
      },
      "policyDocument": Object {
        "Statement": Array [
          Object {
            "Action": "execute-api:Invoke",
            "Effect": "Allow",
            "Resource": "some-method-arn",
          },
        ],
        "Version": "2012-10-17",
      },
      "principalId": "",
    }
  `);
});

test('Non-bearer authorization header', async () => {
  nock.disableNetConnect();

  const result = await handler({
    methodArn: 'some-method-arn',
    headers: {
      authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQK',
    } as APIGatewayRequestAuthorizerEventHeaders,
  } as APIGatewayRequestAuthorizerEvent);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "context": Object {
        "claimed": undefined,
      },
      "policyDocument": Object {
        "Statement": Array [
          Object {
            "Action": "execute-api:Invoke",
            "Effect": "Deny",
            "Resource": "some-method-arn",
          },
        ],
        "Version": "2012-10-17",
      },
      "principalId": "",
    }
  `);
});

test('Invalid token in header', async () => {
  nock.disableNetConnect();

  const result = await handler({
    methodArn: 'some-method-arn',
    headers: {
      authorization: 'Bearer Im-Malformed',
    } as APIGatewayRequestAuthorizerEventHeaders,
  } as APIGatewayRequestAuthorizerEvent);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "context": Object {
        "claimed": undefined,
      },
      "policyDocument": Object {
        "Statement": Array [
          Object {
            "Action": "execute-api:Invoke",
            "Effect": "Deny",
            "Resource": "some-method-arn",
          },
        ],
        "Version": "2012-10-17",
      },
      "principalId": "",
    }
  `);
});

test('Valid token in header', async () => {
  const key = await buildJwk();
  const token = await buildToken(key.privateKey);

  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(200, {
      keys: [key.jwk],
    });

  const result = await handler({
    methodArn: 'some-method-arn',
    headers: {
      authorization: `Bearer ${token}`,
    } as APIGatewayRequestAuthorizerEventHeaders,
  } as APIGatewayRequestAuthorizerEvent);

  expect(result.principalId).toBe(SUBJECT);
  expect(result.policyDocument).toMatchInlineSnapshot(`
    Object {
      "Statement": Array [
        Object {
          "Action": "execute-api:Invoke",
          "Effect": "Allow",
          "Resource": "some-method-arn",
        },
      ],
      "Version": "2012-10-17",
    }
  `);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(Object.keys(result.context!)).toEqual(['claimed']);

  const claims = JSON.parse(result.context?.claimed?.toString() || '');
  expect(claims.aud).toBe(CLIENT_ID);
  expect(claims.iss).toBe(ISSUER);
  expect(claims.sub).toBe(SUBJECT);

  expect(scope.isDone()).toBe(true);
});
