import { generatePolicy } from "./policyService";
import test from "ava";

test("Generate denied policy", (t) => {
  const policy = generatePolicy("my-test-arn", false);
  t.deepEqual(policy, {
    principalId: "",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Deny",
          Resource: "my-test-arn",
        },
      ],
    },
    context: {
      claimed: undefined,
    },
  });
});

test("Generate allowed policy with no claims", (t) => {
  const policy = generatePolicy("my-test-arn", true);
  t.deepEqual(policy, {
    principalId: "",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: "my-test-arn",
        },
      ],
    },
    context: {
      claimed: undefined,
    },
  });
});

test("Generate allowed policy with claims", (t) => {
  const policy = generatePolicy("my-test-arn", true, {
    sub: "my-subject",
  });

  t.deepEqual(policy, {
    principalId: "my-subject",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: "my-test-arn",
        },
      ],
    },
    context: {
      claimed: '{"sub":"my-subject"}',
    },
  });
});

test("Generate denied policy with claims", (t) => {
  const policy = generatePolicy("my-test-arn", false, {
    sub: "my-subject",
  });
  t.deepEqual(policy, {
    principalId: "",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Deny",
          Resource: "my-test-arn",
        },
      ],
    },
    context: {
      claimed: undefined,
    },
  });
});
