import { generatePolicy } from './policyService';

test('Generate denied policy', () => {
  const policy = generatePolicy('my-test-arn', false);
  expect(policy).toMatchInlineSnapshot(`
    Object {
      "context": Object {
        "claimed": undefined,
      },
      "policyDocument": Object {
        "Statement": Array [
          Object {
            "Action": "execute-api:Invoke",
            "Effect": "Deny",
            "Resource": "my-test-arn",
          },
        ],
        "Version": "2012-10-17",
      },
      "principalId": "",
    }
  `);
});

test('Generate allowed policy with no claims', () => {
  const policy = generatePolicy('my-test-arn', true);
  expect(policy).toMatchInlineSnapshot(`
    Object {
      "context": Object {
        "claimed": undefined,
      },
      "policyDocument": Object {
        "Statement": Array [
          Object {
            "Action": "execute-api:Invoke",
            "Effect": "Allow",
            "Resource": "my-test-arn",
          },
        ],
        "Version": "2012-10-17",
      },
      "principalId": "",
    }
  `);
});

test('Generate allowed policy with claims', () => {
  const policy = generatePolicy('my-test-arn', true, {
    sub: 'my-subject',
  });
  expect(policy).toMatchInlineSnapshot(`
    Object {
      "context": Object {
        "claimed": "{\\"sub\\":\\"my-subject\\"}",
      },
      "policyDocument": Object {
        "Statement": Array [
          Object {
            "Action": "execute-api:Invoke",
            "Effect": "Allow",
            "Resource": "my-test-arn",
          },
        ],
        "Version": "2012-10-17",
      },
      "principalId": "my-subject",
    }
  `);
});

test('Generate denied policy with claims', () => {
  const policy = generatePolicy('my-test-arn', false, {
    sub: 'my-subject',
  });
  expect(policy).toMatchInlineSnapshot(`
    Object {
      "context": Object {
        "claimed": undefined,
      },
      "policyDocument": Object {
        "Statement": Array [
          Object {
            "Action": "execute-api:Invoke",
            "Effect": "Deny",
            "Resource": "my-test-arn",
          },
        ],
        "Version": "2012-10-17",
      },
      "principalId": "",
    }
  `);
});
