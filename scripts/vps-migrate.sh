#!/usr/bin/env bash
# Migrări idempotente (Google auth, profil firmă, logo, vizite pagină). Safe de rulat de mai multe ori.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Lipsește .env. Rulează: cp .env.example .env"
  exit 1
fi

set -a
# shellcheck disable=SC1091
# .env pe Windows poate avea CRLF — compatibil Git Bash / WSL
source <(sed 's/\r$//' .env)
set +a

CONTAINER="${MYSQL_CONTAINER:-hostera24-mysql}"
SQL_FILE="$ROOT/backend-hostera24/docker/mysql/migrate-vps-safe.sql"

if [[ ! -f "$SQL_FILE" ]]; then
  echo "Lipsește $SQL_FILE — fă git pull."
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "Containerul $CONTAINER nu rulează. Pornește-l:"
  echo "  docker compose up -d mysql"
  exit 1
fi

echo "→ Migrări MySQL ($MYSQL_DATABASE @ $CONTAINER)..."
if ! docker exec -i "$CONTAINER" mysql \
  --default-character-set=utf8mb4 \
  -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" \
  "$MYSQL_DATABASE" < "$SQL_FILE"; then
  echo "✗ Migrarea a eșuat. Verifică logs și rulează manual: bash scripts/vps-migrate.sh"
  exit 1
fi

echo "✓ Migrări aplicate."
echo "Verificare tabele scanări / vizite:"
docker exec -i "$CONTAINER" mysql \
  -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" \
  "$MYSQL_DATABASE" \
  -e "SHOW TABLES LIKE '%scan%'; SHOW TABLES LIKE 'vizite%'; SHOW COLUMNS FROM vizite_pagina_qr;"
