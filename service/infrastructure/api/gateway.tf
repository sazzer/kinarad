resource "aws_apigatewayv2_api" "api" {
  name                         = "kinarad-${terraform.workspace}"
  protocol_type                = "HTTP"
  disable_execute_api_endpoint = false

  cors_configuration {
    allow_credentials = true
    allow_origins     = ["http://localhost:3000"]
  }

  tags = {
    application = "kinarad"
    environment = terraform.workspace
  }
}

resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "api"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.access_log_group.arn
    format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage $context.authorizer.error"
  }

  tags = {
    application = "kinarad"
    environment = terraform.workspace
  }
}
