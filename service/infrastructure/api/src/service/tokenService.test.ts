import { CLIENT_ID, ISSUER, SUBJECT, buildJwk, buildToken } from '../testUtils';

import { decodeToken } from './tokenService';
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

test('Decode valid token', async () => {
  const key = await buildJwk();
  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(200, {
      keys: [key.jwk],
    });

  const token = await buildToken(key.privateKey);
  const claims = await decodeToken(token);

  expect(claims.aud).toBe(CLIENT_ID);
  expect(claims.iss).toBe(ISSUER);
  expect(claims.sub).toBe(SUBJECT);

  expect(scope.isDone()).toBe(true);
});

test('Decode malformed token', async () => {
  nock.disableNetConnect();

  await expect(async () => await decodeToken('Malformed')).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Failed to decode token"`
  );
});

test('No JWKS returned', async () => {
  const key = await buildJwk();

  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(404);

  await expect(
    async () => await decodeToken(await buildToken(key.privateKey))
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Failed to retrieve signing key"`);

  expect(scope.isDone()).toBe(true);
});

test('Correct JWK not returned', async () => {
  const key = await buildJwk();

  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(200, {
      keys: [],
    });

  await expect(
    async () => await decodeToken(await buildToken(key.privateKey))
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"No key found for kid: AF50EAA6-9A4A-4526-8537-C6BEB0C4CDDE"`);

  expect(scope.isDone()).toBe(true);
});

test('Decode token with wrong issuer', async () => {
  const key = await buildJwk();
  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(200, {
      keys: [key.jwk],
    });

  await expect(
    async () => await decodeToken(await buildToken(key.privateKey, { issuer: 'urn:some-other-issuer' }))
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Failed to decode token"`);

  expect(scope.isDone()).toBe(true);
});

test('Decode token with wrong audience', async () => {
  const key = await buildJwk();
  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(200, {
      keys: [key.jwk],
    });

  await expect(
    async () =>
      await decodeToken(
        await buildToken(key.privateKey, {
          audience: 'urn:some-other-audience',
        })
      )
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Failed to decode token"`);

  expect(scope.isDone()).toBe(true);
});

test('Decode expired token', async () => {
  const key = await buildJwk();
  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(200, {
      keys: [key.jwk],
    });

  await expect(
    async () =>
      await decodeToken(
        await buildToken(key.privateKey, {
          expiration: Math.round(new Date().getTime() / 1000) - 60 * 60 * 4, // 4 hours ago
        })
      )
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Failed to decode token"`);

  expect(scope.isDone()).toBe(true);
});
