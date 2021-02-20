data "aws_region" "current" {}

output "user_pool_id" {
  value = aws_cognito_user_pool.pool.id
}

output "user_pool_arn" {
  value = aws_cognito_user_pool.pool.arn
}

output "client_id" {
  value = aws_cognito_user_pool_client.client.id
}

output "client_secret" {
  value = aws_cognito_user_pool_client.client.client_secret
}

output "url" {
  value = "https://${aws_cognito_user_pool_domain.domain.domain}.auth.${data.aws_region.current.name}.amazoncognito.com"
}

output "issuer" {
  value = "https://${aws_cognito_user_pool.pool.endpoint}"
}
