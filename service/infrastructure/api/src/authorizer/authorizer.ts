import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
} from "aws-lambda";

import { Config } from "./config";
import { JWTPayload } from "jose/webcrypto/types";
import { decodeToken } from "./token";

/** The prefix for the bearer token */
const BEARER_PREFIX = "Bearer ";

/**
 * The actual handler for the authorizer.
 * @param event The incoming event
 */
export async function authorizer(
  event: APIGatewayRequestAuthorizerEvent,
  config: Config
): Promise<APIGatewayAuthorizerResult> {
  const authorization = event.headers?.authorization;

  if (authorization === undefined) {
    // No header, so allow the request with no claims
    return generatePolicy(event.methodArn, true);
  } else if (!authorization.startsWith(BEARER_PREFIX)) {
    // The header is present, but it's not a bearer token, so deny the request
    return generatePolicy(event.methodArn, false);
  } else {
    try {
      const claims = await decodeToken(
        config,
        authorization.substr(BEARER_PREFIX.length)
      );
      return generatePolicy(event.methodArn, true, claims);
    } catch (e) {
      return generatePolicy(event.methodArn, false);
    }
  }
}

/**
 * Generate an IAM policy for this request
 * @param resource The ARN of the resource to generate the policy for
 * @param allowed Whether the request is allowed or not
 */
function generatePolicy(
  resource: string,
  allowed: boolean,
  claims?: JWTPayload
) {
  return {
    principalId: claims?.sub || "",
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
      claimed: JSON.stringify(claims),
    },
  };
}
