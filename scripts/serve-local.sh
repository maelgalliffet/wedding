#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if command -v npx >/dev/null 2>&1; then
  echo "Démarrage du serveur live-reload sur http://localhost:${PORT}"
  echo "Ctrl+C pour arrêter"

  exec npx --yes live-server "${ROOT_DIR}" \
    --host=0.0.0.0 \
    --port="${PORT}" \
    --no-browser
fi

if command -v python3 >/dev/null 2>&1; then
  echo "npx introuvable: fallback sur serveur Python (sans auto-reload navigateur)."
  echo "Démarrage sur http://localhost:${PORT}"
  echo "Ctrl+C pour arrêter"

  exec python3 -m http.server "${PORT}" --bind 0.0.0.0 --directory "${ROOT_DIR}"
fi

echo "Erreur: ni npx ni python3 ne sont disponibles sur cette machine." >&2
echo "Installe Node.js (recommandé pour live-reload) ou Python 3." >&2
exit 1
