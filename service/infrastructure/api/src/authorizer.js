exports.handler = async function (event, context, callback) {
  const authorization = event.headers.authorization;

  if (authorization === "deny") {
    return generatePolicy("user", "Deny", event.routeArn);
  } else if (authorization === "allow") {
    return generatePolicy(
      "424da5dd-f01c-4be7-8d20-7b74c3c63cfa",
      "Allow",
      event.routeArn
    );
  } else {
    return generatePolicy("", "Allow", event.routeArn);
  }
};

// Help function to generate an IAM policy
var generatePolicy = function (principalId, effect, resource) {
  var authResponse = {
    principalId: principalId,
  };

  if (effect && resource) {
    authResponse.policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    };
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    claimed: {
      hello: "world",
    },
  };
  return authResponse;
};
