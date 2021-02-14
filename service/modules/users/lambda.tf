data "archive_file" "get_lambda" {
  type        = "zip"
  source_file = "${path.module}/target/lambdas/get.js"
  output_path = "${path.module}/target/get_lambda.zip"
}

resource "aws_lambda_function" "get_lambda" {
  function_name = "kinarad-${terraform.workspace}-users-get_lambda"

  filename         = data.archive_file.get_lambda.output_path
  role             = aws_iam_role.get_lambda_role.arn
  handler          = "get.handler"
  source_code_hash = data.archive_file.get_lambda.output_base64sha256
  runtime          = "nodejs12.x"

  tags = {
    "application" = "kinarad"
    "module"      = "users"
    "environment" = terraform.workspace
  }
}

resource "aws_iam_role" "get_lambda_role" {
  name = "kinarad-${terraform.workspace}-users-get_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

  tags = {
    project     = "kinarad"
    "module"    = "users"
    environment = terraform.workspace
  }
}

resource "aws_lambda_permission" "get_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = join("/", [var.api.arn, "*", "*", "*"])
}
