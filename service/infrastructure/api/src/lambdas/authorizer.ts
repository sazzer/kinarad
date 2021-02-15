import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';

import { decodeToken } from '../service/tokenService';
import { generatePolicy } from '../service/policyService';

/** The prefix for the bearer token */
const BEARER_PREFIX = 'Bearer ';

/**
 * Authorizer for checking if the incoming request has a valid token.
 * If the token is absent then the authorizer will pass but with no claims.
 * If the token is present then it must be valid, and will be passed along as the claims.
 * If the token is present but not valid then the authorizer will fail.
 *
 * @param event The incoming event
 */
export async function handler(event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> {
  const authorization = event.headers?.authorization;

  if (authorization === undefined) {
    // No header, so allow the request with no claims
    return generatePolicy(event.methodArn, true);
  } else if (!authorization.startsWith(BEARER_PREFIX)) {
    // The header is present, but it's not a bearer token, so deny the request
    return generatePolicy(event.methodArn, false);
  } else {
    try {
      const claims = await decodeToken(authorization.substr(BEARER_PREFIX.length));
      return generatePolicy(event.methodArn, true, claims);
    } catch (e) {
      return generatePolicy(event.methodArn, false);
    }
  }
}
