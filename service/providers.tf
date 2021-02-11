terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  backend "s3" {
    bucket         = "kinarad-state"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "kinarad-locks"
    encrypt        = true
  }
}

provider "aws" {
  profile = "kinarad"
  region  = var.region
}
