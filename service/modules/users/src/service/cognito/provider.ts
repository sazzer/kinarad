import { AWSError, CognitoIdentityServiceProvider } from 'aws-sdk';

import debug from 'debug';

/** The logger to use */
const LOGGER = debug('kinarad:users:service:cognito:provider');

type AdminGetUserResponse = CognitoIdentityServiceProvider.Types.AdminGetUserResponse;

/** The Cognito provider to use */
const COGNITO = new CognitoIdentityServiceProvider();

/** The Cognito user pool to use */
const COGNITO_USER_POOL = process.env.COGNITO_USER_POOL!;

/**
 * Wrapper around the adminGetUser function on the Cognito Service Provider
 * @param username The username of the user to get
 */
export function adminGetUser(username: string): Promise<AdminGetUserResponse> {
  return new Promise<AdminGetUserResponse>((resolve, reject) => {
    COGNITO.adminGetUser(
      {
        Username: username,
        UserPoolId: COGNITO_USER_POOL,
      },
      (err, data) => {
        if (err) {
          LOGGER('Error accessing Cogito user pool %s: %o', COGNITO_USER_POOL, err);
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}
