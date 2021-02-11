resource "aws_apigatewayv2_api" "api" {
  name                         = "kinarad-${terraform.workspace}"
  protocol_type                = "HTTP"
  disable_execute_api_endpoint = false

  cors_configuration {
    allow_credentials = true
    allow_origins     = ["http://localhost:3000"]
  }

  tags = {
    project     = "kinarad"
    environment = terraform.workspace
  }
}

resource "aws_apigatewayv2_integration" "home" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.home_lambda.invoke_arn
}

resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = terraform.workspace
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.log_group.arn
    format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"
  }
}

resource "aws_apigatewayv2_route" "main" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /test"
  target    = join("/", ["integrations", aws_apigatewayv2_integration.home.id])
}
