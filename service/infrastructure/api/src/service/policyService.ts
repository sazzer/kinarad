import { JWTPayload } from "jose/webcrypto/types";

/**
 * Generate an IAM policy for this request
 * @param resource The ARN of the resource to generate the policy for
 * @param allowed Whether the request is allowed or not
 */
export function generatePolicy(
  resource: string,
  allowed: boolean,
  claims?: JWTPayload
) {
  let claimed: string | undefined = undefined;
  if (allowed && claims !== undefined) {
    claimed = JSON.stringify(claims);
  }

  let principalId = "";
  if (allowed && claims?.sub !== undefined) {
    principalId = claims.sub;
  }

  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: allowed ? "Allow" : "Deny",
          Resource: resource,
        },
      ],
    },
    context: {
      claimed,
    },
  };
}
