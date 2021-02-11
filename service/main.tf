module "cognito" {
  source = "./infrastructure/cognito"
}

module "api" {
  source = "./infrastructure/api"

  cognito_client_id = module.cognito.client_id
  cognito_issuer    = module.cognito.issuer
}

module "home" {
  source = "./modules/home"

  api_gateway_id  = module.api.id
  api_gateway_arn = module.api.arn
  authorizer_id   = module.api.authorizer
}
