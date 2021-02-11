data "archive_file" "home_lambda" {
  type        = "zip"
  source_file = "${path.module}/src/home.js"
  output_path = "${path.module}/target/home_lambda.zip"
}

resource "aws_lambda_function" "home_lambda" {
  function_name = "kinarad-${terraform.workspace}-home_lambda"

  filename         = data.archive_file.home_lambda.output_path
  role             = aws_iam_role.home_lambda_role.arn
  handler          = "home.handler"
  source_code_hash = data.archive_file.home_lambda.output_base64sha256
  runtime          = "nodejs12.x"

  tags = {
    "application" = "kinarad"
    "environment" = terraform.workspace
  }
}

resource "aws_iam_role" "home_lambda_role" {
  name = "kinarad-${terraform.workspace}-home_lambda"

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
}

resource "aws_lambda_permission" "home_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.home_lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = join("/", [aws_apigatewayv2_api.api.execution_arn, "*", "*", "*"])
}

resource "aws_iam_role_policy_attachment" "home_lambda_execution" {
  role       = aws_iam_role.home_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
