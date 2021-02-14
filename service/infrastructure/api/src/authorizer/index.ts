import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
} from "aws-lambda";

import { Config } from "./config";
import { authorizer } from "./authorizer";

/**
 * The actual handler for the authorizer.
 * @param event The incoming event
 */
export async function handler(
  event: APIGatewayRequestAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> {
  const config: Config = {
    issuer: process.env.COGNITO_ISSUER!,
    clientId: process.env.COGNITO_CLIENTID!,
  };
  return await authorizer(event, config);
}
