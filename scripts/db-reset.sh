#!/usr/bin/env bash
# Resetează baza de date: șterge tot, aplică schema.sql + seed.sql
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
SCHEMA="$ROOT/backend-hostera24/docker/mysql/schema.sql"
SEED="$ROOT/backend-hostera24/docker/mysql/seed.sql"

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "Containerul $CONTAINER nu rulează. Pornește-l: docker compose up -d"
  exit 1
fi

MYSQL_CLI=(docker exec -i "$CONTAINER" mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE")

echo "→ Șterg tabelele existente"
"${MYSQL_CLI[@]}" <<'EOF'
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS scanari, coduri_qr, firme;
SET FOREIGN_KEY_CHECKS = 1;
EOF

echo "→ Aplic schema.sql"
"${MYSQL_CLI[@]}" < "$SCHEMA"

echo "→ Aplic seed.sql"
"${MYSQL_CLI[@]}" < "$SEED"

echo "✓ Gata. Tabele: firme, coduri_qr, scanari (cu date demo)."
