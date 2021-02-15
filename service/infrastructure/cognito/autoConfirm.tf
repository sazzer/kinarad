data "archive_file" "pre_signup_lambda" {
  type        = "zip"
  source_file = "${path.module}/src/autoConfirm.js"
  output_path = "${path.module}/target/pre_signup_lambda.zip"
}

resource "aws_lambda_function" "pre_signup_lambda" {
  function_name = "kinarad-${terraform.workspace}-pre_signup_lambda"

  filename         = data.archive_file.pre_signup_lambda.output_path
  role             = aws_iam_role.pre_signup_lambda.arn
  handler          = "autoConfirm.handler"
  source_code_hash = data.archive_file.pre_signup_lambda.output_base64sha256
  runtime          = "nodejs12.x"

  tags = {
    application = "kinarad"
    environment = terraform.workspace
  }
}

resource "aws_iam_role" "pre_signup_lambda" {
  name = "kinarad-${terraform.workspace}-pre_signup_lambda"

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

resource "aws_lambda_permission" "pre_signup" {
  action        = "lambda:InvokeFunction"
  function_name = "kinarad-${terraform.workspace}-pre_signup_lambda"
  principal     = "cognito-idp.amazonaws.com"
}
