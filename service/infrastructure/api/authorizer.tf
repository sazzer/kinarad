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

resource "aws_apigatewayv2_authorizer" "optional" {
  name             = "kinarad-${terraform.workspace}-optional"
  api_id           = aws_apigatewayv2_api.api.id
  authorizer_type  = "REQUEST"
  identity_sources = []

  authorizer_uri                    = aws_lambda_function.authorizer_lambda.invoke_arn
  authorizer_payload_format_version = "1.0"
  enable_simple_responses           = false
  authorizer_result_ttl_in_seconds  = 0
}

data "archive_file" "authorizer_lambda" {
  type        = "zip"
  source_file = "${path.module}/target/lambdas/authorizer.js"
  output_path = "${path.module}/target/authorizer_lambda.zip"
}

resource "aws_lambda_function" "authorizer_lambda" {
  function_name = "kinarad-${terraform.workspace}-authorizer_lambda"

  filename         = data.archive_file.authorizer_lambda.output_path
  role             = aws_iam_role.authorizer_lambda_role.arn
  handler          = "authorizer.handler"
  source_code_hash = data.archive_file.authorizer_lambda.output_base64sha256
  runtime          = "nodejs12.x"

  tags = {
    "application" = "kinarad"
    "environment" = terraform.workspace
  }
}

resource "aws_iam_role" "authorizer_lambda_role" {
  name = "kinarad-${terraform.workspace}-authorizer_lambda"

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
    environment = terraform.workspace
  }
}

resource "aws_lambda_permission" "authorizer_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.authorizer_lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = join("/", [aws_apigatewayv2_api.api.execution_arn, "*", "*"])
}

data "aws_iam_policy" "AWSLambdaBasicExecutionRole" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.authorizer_lambda_role.name
  policy_arn = data.aws_iam_policy.AWSLambdaBasicExecutionRole.arn
}
