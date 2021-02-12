output "id" {
  value = aws_apigatewayv2_api.api.id
}
output "endpoint" {
  value = aws_apigatewayv2_api.api.api_endpoint
}
output "arn" {
  value = aws_apigatewayv2_api.api.execution_arn
}

output "full_authorizer" {
  value = aws_apigatewayv2_authorizer.full.id
}

output "optional_authorizer" {
  value = aws_apigatewayv2_authorizer.optional.id
}
