import * as repository from './cognito';

import { UserResource } from '../user';
import debug from 'debug';

/** The logger to use */
const LOGGER = debug('kinarad:users:service:getUser');

/**
 * Load the user with the provided username
 * @param username The username of the user to load
 */
export async function getUserByUsername(username: string): Promise<UserResource | undefined> {
  const user = await repository.getUserByUsername(username);
  LOGGER('Loaded user: %O', user);

  return user;
}
