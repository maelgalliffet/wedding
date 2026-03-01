# wedding

## Structure

- Site statique: `index.html`, `style.css`, `app.js`
- Infrastructure Terraform: `terraform/`

## Terraform

Le code Terraform est isolé dans le dossier `terraform/`.

### 1) Configurer le backend S3 (state distant)

1. Copier `terraform/backend.hcl.example` vers `terraform/backend.hcl`
2. Renseigner:
	- `bucket` (bucket S3 existant dédié au state)
	- `key` (chemin de state, ex: `wedding/prod/terraform.tfstate`)
	- `region`
	- optionnel: `dynamodb_table` pour le lock

### 2) Initialiser Terraform

```bash
terraform -chdir=terraform init -backend-config=backend.hcl -reconfigure
```

### 3) Plan / Apply

```bash
terraform -chdir=terraform plan
terraform -chdir=terraform apply
```

## Notes

- Le bucket de backend S3 doit exister avant `init`.
- Les fichiers de state local (`terraform.tfstate*`) ne sont plus utilisés.

## Prévisualisation locale (port 3000)

Lance le serveur local avec live-reload:

```bash
./scripts/serve-local.sh
```

Le site est accessible sur `http://localhost:3000`.

Optionnel (changer le port):

```bash
PORT=3001 ./scripts/serve-local.sh
```

## Déploiement du site statique

### Script local

Le script `scripts/deploy.sh`:

1. initialise Terraform,
2. lance `terraform apply`,
3. récupère `s3_bucket_name` et `cloudfront_distribution_id` via les outputs Terraform,
4. synchronise les fichiers du site vers S3,
5. lance une invalidation CloudFront.

Variables nécessaires:

- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Configuration backend Terraform (si `terraform/backend.hcl` absent):

- `TF_BACKEND_BUCKET`
- `TF_BACKEND_KEY`
- `TF_BACKEND_REGION` (optionnel, défaut: `AWS_REGION`)
- `TF_BACKEND_DYNAMODB_TABLE` (optionnel)

Exemple:

```bash
AWS_REGION=eu-west-3 \
AWS_ACCESS_KEY_ID=... \
AWS_SECRET_ACCESS_KEY=... \
TF_BACKEND_BUCKET=my-terraform-state-bucket \
TF_BACKEND_KEY=wedding/prod/terraform.tfstate \
./scripts/deploy.sh
```

### Pipeline GitHub Actions

Workflow: `.github/workflows/deploy.yml`

Déclenchement:

- push sur le repository
- exécution manuelle (`workflow_dispatch`)

Configuration GitHub requise:

- **Repository Secrets**:
	- `AWS_ACCESS_KEY_ID`
	- `AWS_SECRET_ACCESS_KEY`
- **Repository Variables**:
	- `AWS_REGION`
	- `TF_BACKEND_BUCKET`
	- `TF_BACKEND_KEY`
	- `TF_BACKEND_REGION` (optionnel)
	- `TF_BACKEND_DYNAMODB_TABLE` (optionnel)

Le rôle IAM doit autoriser au minimum:

- `s3:ListBucket`
- `s3:PutObject`
- `s3:DeleteObject`
- `cloudfront:CreateInvalidation` (si CloudFront utilisé)