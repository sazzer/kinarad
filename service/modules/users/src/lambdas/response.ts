import { HAL } from '@kinarad-service/http';

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
 */
export function buildResponse(): HAL<UserResponse> {
  return new HAL({
    username: 'sazzer',
    displayName: 'Graham',
    email: 'graham@grahamcox.co.uk',
    enabled: true,
    status: 'CONFIRMED',
  })
    .withLink('self', { href: '/api/users/sazzer' })
    .withHeader('cache-control', 'public, max-age=3600');
}
