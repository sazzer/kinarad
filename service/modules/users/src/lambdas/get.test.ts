import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { adminGetUserMock } from '../__mocks__/aws-sdk/clients/cognitoidentityserviceprovider';
import { handler } from './get';

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

  const response = await handler(({
    pathParameters: {
      userId: 'unknown',
    },
  } as unknown) as APIGatewayProxyEventV2);

  expect(response.statusCode).toBe(404);
  expect(response.headers).toEqual({
    'content-type': 'application/problem+json',
    'cache-control': 'no-cache',
  });
  expect(JSON.parse(response.body!)).toEqual({
    status: 404,
  });
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

  const response = await handler(({
    pathParameters: {
      userId: 'known',
    },
  } as unknown) as APIGatewayProxyEventV2);

  expect(response.statusCode).toBe(200);
  expect(response.headers).toEqual({
    'content-type': 'application/hal+json',
    'cache-control': 'public, max-age=3600',
    etag: '"MjAyMS0wMi0yMVQxMDoyMDoxMi42NzRa"',
  });
  expect(JSON.parse(response.body!)).toEqual({
    _links: {
      self: {
        href: '/api/users/known',
      },
    },
    displayName: 'Test User',
    email: 'testuser@example.com',
    enabled: true,
    status: 'CONFIRMED',
    username: 'known',
  });
});

test('Get partially populated user', async () => {
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

  const response = await handler(({
    pathParameters: {
      userId: 'known',
    },
  } as unknown) as APIGatewayProxyEventV2);

  expect(response.statusCode).toBe(200);
  expect(response.headers).toEqual({
    'content-type': 'application/hal+json',
    'cache-control': 'public, max-age=3600',
    etag: '"MjAyMS0wMi0yMVQxMDoyMDoxMi42NzRa"',
  });
  expect(JSON.parse(response.body!)).toEqual({
    _links: {
      self: {
        href: '/api/users/known',
      },
    },
    enabled: true,
    status: 'UNCONFIRMED',
    username: 'known',
  });
});

test('No username', async () => {
  const response = await handler(({
    pathParameters: {},
  } as unknown) as APIGatewayProxyEventV2);

  expect(response.statusCode).toBe(404);
  expect(response.headers).toEqual({
    'content-type': 'application/problem+json',
    'cache-control': 'no-cache',
  });
  expect(JSON.parse(response.body!)).toEqual({
    status: 404,
  });
  expect(adminGetUserMock).not.toHaveBeenCalled();
});
