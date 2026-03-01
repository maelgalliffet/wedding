#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TF_DIR="${ROOT_DIR}/terraform"
AWS_REGION="eu-west-3"

if ! command -v aws >/dev/null 2>&1; then
  echo "Erreur: AWS CLI introuvable." >&2
  exit 1
fi

if ! command -v terraform >/dev/null 2>&1; then
  echo "Erreur: Terraform CLI introuvable." >&2
  exit 1
fi

if [[ -z "${AWS_ACCESS_KEY_ID:-}" || -z "${AWS_SECRET_ACCESS_KEY:-}" ]]; then
  echo "Erreur: AWS_ACCESS_KEY_ID et AWS_SECRET_ACCESS_KEY sont requis." >&2
  exit 1
fi

echo "Initialisation Terraform..."
if [[ -f "${TF_DIR}/backend.hcl" ]]; then
  terraform -chdir="${TF_DIR}" init -input=false -backend-config=backend.hcl -reconfigure
else
  terraform -chdir="${TF_DIR}" init -input=false -reconfigure
fi

echo "Application Terraform..."
terraform -chdir="${TF_DIR}" apply -auto-approve -input=false

S3_BUCKET="$(terraform -chdir="${TF_DIR}" output -raw s3_bucket_name)"
CLOUDFRONT_DISTRIBUTION_ID="$(terraform -chdir="${TF_DIR}" output -raw cloudfront_distribution_id)"

echo "Déploiement vers s3://${S3_BUCKET} (region: ${AWS_REGION})"

aws s3 sync "${ROOT_DIR}" "s3://${S3_BUCKET}" \
  --region "${AWS_REGION}" \
  --delete \
  --exclude ".git/*" \
  --exclude ".github/*" \
  --exclude ".vscode/*" \
  --exclude "terraform/*" \
  --exclude "scripts/*" \
  --exclude "README.md" \
  --exclude ".gitignore"

if [[ -n "${CLOUDFRONT_DISTRIBUTION_ID}" ]]; then
  echo "Invalidation CloudFront: ${CLOUDFRONT_DISTRIBUTION_ID}"
  aws cloudfront create-invalidation \
    --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
    --paths "/*" \
    --region "${AWS_REGION}" >/dev/null
else
  echo "CLOUDFRONT_DISTRIBUTION_ID non défini: invalidation CloudFront ignorée."
fi

echo "Déploiement terminé."
