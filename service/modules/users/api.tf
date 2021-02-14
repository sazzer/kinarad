resource "aws_apigatewayv2_integration" "get" {
  api_id             = var.api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.get_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "main" {
  api_id             = var.api.id
  route_key          = "GET /users/{userId}"
  target             = join("/", ["integrations", aws_apigatewayv2_integration.get.id])
  authorization_type = "CUSTOM"
  authorizer_id      = var.api.optional_authorizer
}
