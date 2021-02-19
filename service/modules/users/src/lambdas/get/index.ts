import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { NOT_FOUND_PROBLEM, Response } from '@kinarad-service/http';

/**
 * Handler for retrieving a single user by ID.
 *
 * @param event The incoming event
 * @param context The context to operate under
 */
export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  return new Response(NOT_FOUND_PROBLEM());
}
