import { UserResource } from '../../user';
import { adminGetUser } from './provider';

/**
 * Load the user with the provided username
 * @param username The username of the user to load
 */
export async function getUserByUsername(username: string): Promise<UserResource | undefined> {
  const user = await adminGetUser(username);

  if (username === 'sazzer') {
    return {
      identity: {
        id: username,
        version: 'someVersion',
        created: new Date(),
        updated: new Date(),
      },
      data: {
        email: 'graham@grahamcox.co.uk',
        displayName: 'Graham',
        enabled: true,
        status: 'CONFIRMED',
      },
    };
  } else {
    return undefined;
  }
}
