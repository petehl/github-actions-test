locals {
  default_name = "${var.environment}-sd-frontend"
  common_tags = {
    Name        = "${var.environment}-sd-frontend"
    Environment = var.environment
    Test        = "final update"
  }
}

terraform {
  backend "s3" {

  }
}


provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.region
}

data "aws_availability_zones" "available" {}

resource "aws_vpc" "public" {
  cidr_block = "10.0.0.0/16"
  tags       = merge(local.common_tags, { Name = "${local.default_name}-vpc_public" })
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.public.id
  tags   = merge(local.common_tags, { Name = "${local.default_name}-igw" })
}

output "aws_vpc_public" {
  value = aws_vpc.public.id
}

output "aws_internet_gateway_igw" {
  value = aws_internet_gateway.igw.id
}