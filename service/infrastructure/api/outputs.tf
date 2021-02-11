output "id" {
  value = aws_apigatewayv2_api.api.id
}
output "endpoint" {
  value = aws_apigatewayv2_api.api.api_endpoint
}
output "arn" {
  value = aws_apigatewayv2_api.api.execution_arn
}

output "authorizer" {
  value = aws_apigatewayv2_authorizer.cognito.id
}
