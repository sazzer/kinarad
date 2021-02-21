import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

type AdminGetUserResponse = CognitoIdentityServiceProvider.Types.AdminGetUserResponse;

/**
 * Wrapper around the adminGetUser function on the Cognito Service Provider
 * @param username The username of the user to get
 */
export function adminGetUser(username: string): Promise<AdminGetUserResponse> {
  return new Promise<AdminGetUserResponse>((resolve, reject) => {
    const cognito = new CognitoIdentityServiceProvider();
    cognito.adminGetUser(
      {
        Username: username,
        UserPoolId: process.env.COGNITO_USER_POOL!,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}
