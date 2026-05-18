#!/usr/bin/env bash
# Resetează baza de date folosind reset.sql (ștergere + schema + seed demo)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Lipsește .env în rădăcina proiectului. Rulează: cp .env.example .env"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

CONTAINER="${MYSQL_CONTAINER:-hostera24-mysql}"
RESET_SQL="$ROOT/backend-hostera24/docker/mysql/reset.sql"

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "Containerul $CONTAINER nu rulează. Pornește-l: docker compose up -d"
  exit 1
fi

echo "→ Aplic reset.sql (utf8mb4)"
docker exec -i "$CONTAINER" mysql \
  --default-character-set=utf8mb4 \
  -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" \
  "$MYSQL_DATABASE" < "$RESET_SQL"

echo "✓ Gata. Tabele: firme, coduri_qr, scanari (cu date demo, parolă: password)."
