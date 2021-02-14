import {
  APIGatewayRequestAuthorizerEvent,
  APIGatewayRequestAuthorizerEventHeaders,
} from "aws-lambda";
import { DecodeError, decodeToken } from "./token";
import { TOKEN_CONFIG, buildJwk, buildToken } from "./testUtils";

import { authorizer } from "./authorizer";
import nock from "nock";
import test from "ava";

test("No headers", async (t) => {
  nock.disableNetConnect();

  const result = await authorizer(
    {
      type: "REQUEST",
      methodArn: "some-method-arn",
      resource: "",
      path: "/api",
      httpMethod: "GET",
    } as APIGatewayRequestAuthorizerEvent,
    TOKEN_CONFIG
  );

  t.deepEqual(result, {
    principalId: "",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: "some-method-arn",
        },
      ],
    },
    context: {},
  });
});

test("No authorization header", async (t) => {
  nock.disableNetConnect();

  const result = await authorizer(
    {
      type: "REQUEST",
      methodArn: "some-method-arn",
      resource: "",
      path: "/api",
      httpMethod: "GET",
      headers: {},
    } as APIGatewayRequestAuthorizerEvent,
    TOKEN_CONFIG
  );

  t.deepEqual(result, {
    principalId: "",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: "some-method-arn",
        },
      ],
    },
    context: {},
  });
});

test("Non-bearer authorization header", async (t) => {
  nock.disableNetConnect();

  const result = await authorizer(
    {
      type: "REQUEST",
      methodArn: "some-method-arn",
      resource: "",
      path: "/api",
      httpMethod: "GET",
      headers: {
        authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQK",
      } as APIGatewayRequestAuthorizerEventHeaders,
    } as APIGatewayRequestAuthorizerEvent,
    TOKEN_CONFIG
  );

  t.deepEqual(result, {
    principalId: "",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Deny",
          Resource: "some-method-arn",
        },
      ],
    },
    context: {},
  });
});

test("Invalid token in header", async (t) => {
  nock.disableNetConnect();

  const result = await authorizer(
    {
      type: "REQUEST",
      methodArn: "some-method-arn",
      resource: "",
      path: "/api",
      httpMethod: "GET",
      headers: {
        authorization: "Bearer Im-Malformed",
      } as APIGatewayRequestAuthorizerEventHeaders,
    } as APIGatewayRequestAuthorizerEvent,
    TOKEN_CONFIG
  );

  t.deepEqual(result, {
    principalId: "",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Deny",
          Resource: "some-method-arn",
        },
      ],
    },
    context: {},
  });
});

test("Valid token in header", async (t) => {
  const key = await buildJwk();
  const token = await buildToken(key.privateKey);

  const scope = nock("https://cognito-idp.eu-west-2.amazonaws.com")
    .get("/eu-west-2_h96upvx9t/.well-known/jwks.json")
    .reply(200, {
      keys: [key.jwk],
    });

  const result = await authorizer(
    {
      type: "REQUEST",
      methodArn: "some-method-arn",
      resource: "",
      path: "/api",
      httpMethod: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      } as APIGatewayRequestAuthorizerEventHeaders,
    } as APIGatewayRequestAuthorizerEvent,
    TOKEN_CONFIG
  );

  t.deepEqual(result, {
    principalId: "",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: "some-method-arn",
        },
      ],
    },
    context: {},
  });
  t.true(scope.isDone());
});
