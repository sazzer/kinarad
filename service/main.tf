module "cognito" {
  source = "./infrastructure/cognito"
}

module "api" {
  source = "./infrastructure/api"

  cognito = module.cognito
}

module "home" {
  source = "./modules/home"

  api = module.api
}

module "users" {
  source = "./modules/users"

  api     = module.api
  cognito = module.cognito
}
