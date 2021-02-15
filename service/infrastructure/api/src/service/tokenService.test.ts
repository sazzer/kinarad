import { CLIENT_ID, ISSUER, KEY_ID, SUBJECT, buildJwk, buildToken } from '../testUtils';
import { DecodeError, decodeToken } from './tokenService';

import nock from 'nock';
import test from 'ava';

test('Decode valid token', async (t) => {
  const key = await buildJwk();
  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(200, {
      keys: [key.jwk],
    });

  const claims = await decodeToken(await buildToken(key.privateKey));

  t.is(claims.aud, CLIENT_ID);
  t.is(claims.iss, ISSUER);
  t.is(claims.sub, SUBJECT);

  t.true(scope.isDone());
});

test('Decode malformed token', async (t) => {
  nock.disableNetConnect();

  await t.throwsAsync(async () => await decodeToken('Malformed'), {
    instanceOf: DecodeError,
    message: 'Failed to decode token',
  });
});

test('No JWKS returned', async (t) => {
  const key = await buildJwk();

  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(404);

  await t.throwsAsync(async () => await decodeToken(await buildToken(key.privateKey)), {
    instanceOf: DecodeError,
    message: 'Failed to retrieve signing key',
  });

  t.true(scope.isDone());
});

test('Correct JWK not returned', async (t) => {
  const key = await buildJwk();

  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(200, {
      keys: [],
    });

  await t.throwsAsync(async () => await decodeToken(await buildToken(key.privateKey)), {
    instanceOf: DecodeError,
    message: 'No key found for kid: ' + KEY_ID,
  });

  t.true(scope.isDone());
});

test('Decode token with wrong issuer', async (t) => {
  const key = await buildJwk();
  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(200, {
      keys: [key.jwk],
    });

  await t.throwsAsync(
    async () => await decodeToken(await buildToken(key.privateKey, { issuer: 'urn:some-other-issuer' })),
    {
      instanceOf: DecodeError,
      message: 'Failed to decode token',
    }
  );

  t.true(scope.isDone());
});

test('Decode token with wrong audience', async (t) => {
  const key = await buildJwk();
  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(200, {
      keys: [key.jwk],
    });

  await t.throwsAsync(
    async () =>
      await decodeToken(
        await buildToken(key.privateKey, {
          audience: 'urn:some-other-audience',
        })
      ),
    {
      instanceOf: DecodeError,
      message: 'Failed to decode token',
    }
  );

  t.true(scope.isDone());
});

test('Decode expired token', async (t) => {
  const key = await buildJwk();
  const scope = nock('https://cognito-idp.eu-west-2.amazonaws.com')
    .get('/eu-west-2_h96upvx9t/.well-known/jwks.json')
    .reply(200, {
      keys: [key.jwk],
    });

  await t.throwsAsync(
    async () =>
      await decodeToken(
        await buildToken(key.privateKey, {
          expiration: Math.round(new Date().getTime() / 1000) - 60 * 60 * 4, // 4 hours ago
        })
      ),
    {
      instanceOf: DecodeError,
      message: 'Failed to decode token',
    }
  );

  t.true(scope.isDone());
});
