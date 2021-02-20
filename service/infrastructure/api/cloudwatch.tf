resource "aws_cloudwatch_log_group" "access_log_group" {
  name              = "/aws/api_gateway/kinarad-${terraform.workspace}-access"
  retention_in_days = 5

  tags = {
    application = "kinarad"
    environment = terraform.workspace
  }
}

resource "aws_cloudwatch_log_group" "authorizer_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.authorizer_lambda.function_name}"

  retention_in_days = 5

  tags = {
    application = "kinarad"
    environment = terraform.workspace
  }
}
