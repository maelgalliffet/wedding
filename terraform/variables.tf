variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3"
}

variable "domain_name" {
  description = "Domain name for the website"
  type        = string
  default     = "wedding.elwakil.galliffet.fr"
}

variable "zone_id" {
  description = "Route53 zone ID for galliffet.fr"
  type        = string
  sensitive   = true
}
