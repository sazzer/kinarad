import { UserResource } from '../../user';
import { adminGetUser } from './provider';
import debug from 'debug';

/** The logger to use */
const LOGGER = debug('kinarad:users:service:cognito:getUser');

/**
 * Load the user with the provided username
 * @param username The username of the user to load
 */
export async function getUserByUsername(username: string): Promise<UserResource | undefined> {
  try {
    LOGGER('Loading user with username: %s', username);
    const user = await adminGetUser(username);
    LOGGER('Loaded user with username %s: %o', username, user);

    const bufferObj = Buffer.from(user.UserLastModifiedDate?.toISOString()!, 'utf8');
    const version = bufferObj.toString('base64');

    const email = user.UserAttributes?.find((att) => att.Name === 'email')?.Value;
    const displayName = user.UserAttributes?.find((att) => att.Name === 'name')?.Value;

    return {
      identity: {
        id: user.Username,
        version,
        created: user.UserCreateDate!,
        updated: user.UserLastModifiedDate!,
      },
      data: {
        email,
        displayName,
        enabled: user.Enabled ?? false,
        status: user.UserStatus ?? 'UNKNOWN',
      },
    };
  } catch (e) {
    if (e.code === 'UserNotFoundException') {
      LOGGER("User with username %s doesn't exist", username);
      return undefined;
    } else {
      LOGGER('Error getting user with username %s: %o', username, e);
      throw e;
    }
  }
}
