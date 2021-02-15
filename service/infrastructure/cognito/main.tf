resource "aws_cognito_user_pool" "pool" {
  name = "kinarad-${terraform.workspace}"

  alias_attributes         = ["email"]
  auto_verified_attributes = ["email"]
  mfa_configuration        = "OFF"

  lambda_config {
    pre_sign_up = aws_lambda_function.pre_signup_lambda.arn
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  username_configuration {
    case_sensitive = false
  }

  password_policy {
    minimum_length                   = 8
    require_lowercase                = false
    require_numbers                  = false
    require_symbols                  = false
    require_uppercase                = false
    temporary_password_validity_days = 7
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = true
    required            = true

    string_attribute_constraints {
      min_length = "3"
      max_length = "260"
    }
  }

  schema {
    name                = "name"
    attribute_data_type = "String"
    mutable             = true
    required            = true

    string_attribute_constraints {
      min_length = "1"
      max_length = "100"
    }
  }

  tags = {
    application = "kinarad"
    environment = terraform.workspace
  }
}

resource "aws_cognito_user_pool_domain" "domain" {
  domain       = "kinarad-${terraform.workspace}"
  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_user_pool_client" "client" {
  name         = "kinarad-${terraform.workspace}"
  user_pool_id = aws_cognito_user_pool.pool.id

  generate_secret = true

  allowed_oauth_flows                  = ["implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["openid", "email", "profile", "aws.cognito.signin.user.admin"]

  callback_urls = ["http://localhost:3000/callback.html"]
  logout_urls   = ["http://localhost:3000"]

  explicit_auth_flows           = ["ADMIN_NO_SRP_AUTH"]
  prevent_user_existence_errors = "ENABLED"
  supported_identity_providers  = ["COGNITO"]
}
