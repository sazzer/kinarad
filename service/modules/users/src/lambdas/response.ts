import { HAL } from '@kinarad-service/http';
import { UserResource } from '../user';

/**
 * Response body details representing a user
 */
interface UserResponse {
  readonly username: string;
  readonly displayName: string;
  readonly email: string;
  readonly enabled: boolean;
  readonly status: string;
}

/**
 * Build the API response for a given user
 * @param user The user to build the response for
 */
export function buildResponse(user: UserResource): HAL<UserResponse> {
  return new HAL({
    username: user.identity.id,
    displayName: user.data.displayName,
    email: user.data.email,
    enabled: user.data.enabled,
    status: user.data.status,
  })
    .withLink('self', { href: `/api/users/${user.identity.id}` })
    .withHeader('etag', `"${user.identity.version}"`)
    .withHeader('cache-control', 'public, max-age=3600');
}
