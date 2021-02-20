import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { NOT_FOUND_PROBLEM, Response } from '@kinarad-service/http';

import { buildResponse } from './response';
import { getUserByUsername } from '../service';

/**
 * Handler for retrieving a single user by ID.
 *
 * @param event The incoming event
 * @param context The context to operate under
 */
export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const username = event.pathParameters?.userId;

  if (username === undefined || username === '') {
    return new Response(NOT_FOUND_PROBLEM());
  }

  const user = await getUserByUsername(username);
  if (user === undefined) {
    return new Response(NOT_FOUND_PROBLEM());
  }

  return new Response(buildResponse(user));
}
