import { adminGetUserMock } from '../__mocks__/aws-sdk/clients/cognitoidentityserviceprovider';
import { getUserByUsername } from './cognito/getUser';

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env.COGNITO_USER_POOL = 'SomeUserPoolId';
});

afterAll(() => {
  process.env = OLD_ENV;
});

test('Get unknown user', async () => {
  adminGetUserMock.mockImplementation((params, callback) => {
    expect(params.Username).toBe('unknown');
    expect(params.UserPoolId).toBe('SomeUserPoolId');
    callback(
      {
        code: 'UserNotFoundException',
      },
      undefined
    );
  });
  const user = await getUserByUsername('unknown');

  expect(user).toBeUndefined();
});

test('Error returned', async () => {
  const error = {
    code: 'InternalErrorException',
  };
  adminGetUserMock.mockImplementation((params, callback) => {
    expect(params.Username).toBe('unknown');
    expect(params.UserPoolId).toBe('SomeUserPoolId');
    callback(error, undefined);
  });

  return expect(() => getUserByUsername('unknown')).rejects.toEqual(error);
});

test('Get fully populated user', async () => {
  adminGetUserMock.mockImplementation((params, callback) => {
    expect(params.Username).toBe('known');
    expect(params.UserPoolId).toBe('SomeUserPoolId');
    callback(undefined, {
      Username: 'known',
      UserAttributes: [
        { Name: 'sub', Value: 'a8a719b0-9aa0-4e7e-b8cf-1af976486081' },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: 'Test User' },
        { Name: 'email', Value: 'testuser@example.com' },
      ],
      UserCreateDate: new Date('2021-02-20T18:38:24.776Z'),
      UserLastModifiedDate: new Date('2021-02-21T10:20:12.674Z'),
      Enabled: true,
      UserStatus: 'CONFIRMED',
    });
  });
  const user = await getUserByUsername('known');

  expect(user).toEqual({
    identity: {
      id: 'known',
      version: 'MjAyMS0wMi0yMVQxMDoyMDoxMi42NzRa',
      created: new Date('2021-02-20T18:38:24.776Z'),
      updated: new Date('2021-02-21T10:20:12.674Z'),
    },
    data: {
      displayName: 'Test User',
      email: 'testuser@example.com',
      enabled: true,
      status: 'CONFIRMED',
    },
  });
});

test('Get barely populated user', async () => {
  adminGetUserMock.mockImplementation((params, callback) => {
    expect(params.Username).toBe('known');
    expect(params.UserPoolId).toBe('SomeUserPoolId');
    callback(undefined, {
      Username: 'known',
      UserAttributes: [],
      UserCreateDate: new Date('2021-02-20T18:38:24.776Z'),
      UserLastModifiedDate: new Date('2021-02-21T10:20:12.674Z'),
      Enabled: true,
      UserStatus: 'UNCONFIRMED',
    });
  });
  const user = await getUserByUsername('known');

  expect(user).toEqual({
    identity: {
      id: 'known',
      version: 'MjAyMS0wMi0yMVQxMDoyMDoxMi42NzRa',
      created: new Date('2021-02-20T18:38:24.776Z'),
      updated: new Date('2021-02-21T10:20:12.674Z'),
    },
    data: {
      enabled: true,
      status: 'UNCONFIRMED',
    },
  });
});
