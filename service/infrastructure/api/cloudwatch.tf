resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/api_gateway"
  retention_in_days = 5

  tags = {
    "application" = "kinarad"
    "environment" = terraform.workspace
  }
}
