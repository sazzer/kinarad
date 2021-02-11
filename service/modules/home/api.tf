resource "aws_apigatewayv2_integration" "home" {
  api_id             = var.api_gateway_id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.home_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "main" {
  api_id    = var.api_gateway_id
  route_key = "GET /"
  target    = join("/", ["integrations", aws_apigatewayv2_integration.home.id])
}
