import * as repository from './cognito';

import { UserResource } from '../user';

/**
 * Load the user with the provided username
 * @param username The username of the user to load
 */
export async function getUserByUsername(username: string): Promise<UserResource | undefined> {
  return await repository.getUserByUsername(username);
}
