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

  environment {
    variables = {
      "COGNITO_USER_POOL" = var.cognito.user_pool_id
    }
  }
  
  tags = {
    application = "kinarad"
    module      = "users"
    environment = terraform.workspace
  }
}

resource "aws_cloudwatch_log_group" "get_lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.get_lambda.function_name}"
  retention_in_days = 5

  tags = {
    application = "kinarad"
    environment = terraform.workspace
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
    application = "kinarad"
    module      = "users"
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

resource "aws_iam_role_policy_attachment" "get_lambda_logs" {
  role       = aws_iam_role.get_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource aws_iam_role_policy get_lambda_role {
  # name   = "Role-Policy-Cognito-Check-User-Expiry"
  role   = aws_iam_role.get_lambda_role.id
  policy = data.aws_iam_policy_document.get_lambda_policy.json
}

data aws_iam_policy_document get_lambda_policy {
  statement {
    sid = "AllowLambdaGetUser"
    actions = [
      "cognito-idp:AdminGetUser"
    ]
    resources = [var.cognito.user_pool_arn]
  }
}