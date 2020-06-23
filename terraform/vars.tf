# variables

variable "aws_access_key" {
  type        = string
  description = "Secret, should never be stored in Revision Control"
}

variable "aws_secret_key" {
  type        = string
  description = "Secret, should never be stored in Revision Control"
}

variable "region" {
  type        = string
  default     = "eu-west-1"
  description = "The AWS region to create things in."
}

variable "environment" {
  type        = string
  description = "The environment that the configuration is to be deployed to"
}

variable "assume_role_arn" {
  type = string
}

variable "az_count" {
  type        = string
  description = "Number of Availbility zones to cover in a given AWS region"
  default     = "2"
}