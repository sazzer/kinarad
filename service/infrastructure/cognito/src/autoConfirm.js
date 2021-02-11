/**
 * Lambda to act as a Pre Signup trigger for Cognito to auto-confirm all users.
 */
exports.handler = (event, context, callback) => {
  event.response.autoConfirmUser = false;
  callback(null, event);
};
