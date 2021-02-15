import { KeyLike } from 'jose/types';
import SignJWT from 'jose/jwt/sign';
import fromKeyLike from 'jose/jwk/from_key_like';
import generateKeyPair from 'jose/util/generate_key_pair';

/** The issuer to use */
export const ISSUER = 'https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_h96upvx9t';

/** The Client ID to use */
export const CLIENT_ID = 'FB4AC1CB-1D7E-4125-97DC-7A5B947B9543';

/** The key ID to use */
export const KEY_ID = 'AF50EAA6-9A4A-4526-8537-C6BEB0C4CDDE';

/** The key algorithm to use */
const KEY_ALG = 'RS256';

/** The subject in the created token */
export const SUBJECT = 'some-user-id';

/**
 * Build a JWT token to provide to the tests
 * @param privateKey the private key to sign the token with
 * @param params the additional parameters to use instead of the defaults
 * @return the JWT token
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
export async function buildToken(privateKey: KeyLike, params?: Record<string, any>) {
  return await new SignJWT({})
    .setProtectedHeader({
      alg: KEY_ALG,
      kid: KEY_ID,
    })
    .setIssuedAt()
    .setIssuer(params?.issuer || ISSUER)
    .setAudience(params?.audience || CLIENT_ID)
    .setExpirationTime(params?.expiration || '2h')
    .setSubject(SUBJECT)
    .sign(privateKey);
}

/**
 * Helper to build a signing key to use
 * @return the signing key
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function buildJwk() {
  const { publicKey, privateKey } = await generateKeyPair(KEY_ALG);

  const jwk = await fromKeyLike(publicKey);
  return {
    jwk: {
      alg: KEY_ALG,
      kid: KEY_ID,
      ...jwk,
    },
    publicKey,
    privateKey,
  };
}
