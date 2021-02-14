import { Config } from "./config";
import { KeyLike } from "jose/webcrypto/types";
import SignJWT from "jose/webcrypto/jwt/sign";
import fromKeyLike from "jose/webcrypto/jwk/from_key_like";
import generateKeyPair from "jose/webcrypto/util/generate_key_pair";

/** The configuration to use for the token processing */
export const TOKEN_CONFIG: Config = {
  issuer: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_h96upvx9t",
  clientId: "FB4AC1CB-1D7E-4125-97DC-7A5B947B9543",
};

/** The key ID to use */
const KEY_ID = "k+rc3UaUU/yoeMpMLg0nnmeBGuuLRdshDeHPCB0eBGU=";

/** The key algorithm to use */
const KEY_ALG = "RS256";

/** The subject in the created token */
export const SUBJECT = "some-user-id";

//////////
// Helper functions
//////////
export async function buildToken(
  privateKey: KeyLike,
  params?: Record<string, any>
) {
  return await new SignJWT({})
    .setProtectedHeader({
      alg: KEY_ALG,
      kid: KEY_ID,
    })
    .setIssuedAt()
    .setIssuer(params?.issuer || TOKEN_CONFIG.issuer)
    .setAudience(params?.audience || TOKEN_CONFIG.clientId)
    .setExpirationTime(params?.expiration || "2h")
    .setSubject(SUBJECT)
    .sign(privateKey);
}

/**
 * Helper to build a signing key to use
 */
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
