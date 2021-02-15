import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

/**
 * Handler for retrieving a single user by ID.
 *
 * @param event The incoming event
 * @param context The context to operate under
 */
export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      name: event.pathParameters?.userId,
    }),
  };
}
