module "api" {
  source = "./infrastructure/api"
}

module "home" {
  source = "./modules/home"

  api_gateway_id  = module.api.id
  api_gateway_arn = module.api.arn
}
