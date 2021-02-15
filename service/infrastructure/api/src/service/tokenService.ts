import { JWK, JWTPayload } from 'jose/webcrypto/types';
import jwtVerify, { JWSHeaderParameters } from 'jose/jwt/verify';

import axios from 'axios';
import debug from 'debug';
import parseJwk from 'jose/jwk/parse';

/** The logger to use */
const LOG = debug('kinarad:infrastructure:api:token');

/**
 * Decode the provided token to provide the claims for the user.
 * @param config The config for decoding the token
 * @param token The token to decode
 */
export async function decodeToken(token: string): Promise<JWTPayload> {
  try {
    const parsed = await jwtVerify(token, getKey, {
      issuer: process.env.COGNITO_ISSUER,
      audience: process.env.COGNITO_CLIENTID,
    });
    LOG('Parsed token: %o', parsed);

    return parsed.payload;
  } catch (e) {
    LOG('Failed to parse token %s: %o', token, e);
    if (e instanceof DecodeError) {
      throw e;
    }

    throw new DecodeError('Failed to decode token');
  }
}

/**
 * Error thrown when failing to decode a token
 */
export class DecodeError extends Error {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DecodeError.prototype);
  }
}

/**
 * Shape of the JWKS response containing the keys
 */
interface Keys {
  keys: JWK[];
}

/**
 * Get the signing key for a token being decoded.
 * @param header The decoded header of the token, containing the ID of the signing key.
 *
 */
async function getKey(header: JWSHeaderParameters) {
  const url = process.env.COGNITO_ISSUER + '/.well-known/jwks.json';
  LOG('Using URL to retrieve keys: %s', url);

  LOG('Getting JWK for kid %s', header.kid);

  let keys: Keys;
  try {
    const response = await axios.get<Keys>(url);
    keys = response.data;
  } catch (e) {
    LOG('Failed to retrieve JWK: %o', e);
    throw new DecodeError('Failed to retrieve signing key');
  }
  LOG('Retrieved keys: %o', keys);

  const key = keys.keys.find((k) => k.kid === header.kid);
  if (key === undefined) {
    LOG('No key found for kid %s', header.kid);
    throw new DecodeError('No key found for kid: ' + header.kid);
  }
  LOG('Got key for kid %s: %o', header.kid, key);

  return await parseJwk(key);
}
