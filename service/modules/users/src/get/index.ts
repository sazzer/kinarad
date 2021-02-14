import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";

/**
 * Handler for retrieving a single user by ID.
 *
 * @param event The incoming event
 * @param context The context to operate under
 */
export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2<string>> {
  return {
    statusCode: 200,
    body: "Hello, World!",
  };
}
