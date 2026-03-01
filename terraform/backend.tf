terraform {
  backend "s3" {
    bucket       = "wedding-elwakil-galliffet-terraform-state"
    key          = "terraform.tfstate"
    region       = "eu-west-3"
    encrypt      = true
    use_lockfile = true
  }
}
