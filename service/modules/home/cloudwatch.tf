resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/lambda/home_lambda"
  retention_in_days = 5
  tags = {
    "application" = "kinarad"
    "environment" = terraform.workspace
  }
}
