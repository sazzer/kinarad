export const adminGetUserMock = jest.fn();

export default class CognitoIdentityServiceProvider {
  adminGetUser = adminGetUserMock;
}
