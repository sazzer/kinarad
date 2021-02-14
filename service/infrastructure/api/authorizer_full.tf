resource "aws_apigatewayv2_authorizer" "full" {
  name             = "kinarad-${terraform.workspace}-full"
  api_id           = aws_apigatewayv2_api.api.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]

  jwt_configuration {
    audience = [var.cognito.client_id]
    issuer   = var.cognito.issuer
  }
}
