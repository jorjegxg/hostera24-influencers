#!/usr/bin/env bash
# Pornește MySQL (Docker), backend și frontend în terminale separate.
#
#   bash scripts/dev-stack.sh
#   npm run dev:stack
#   npm run dev:all          (alias)
#
# Opțiuni:
#   SKIP_MIGRATE=1   — nu rulează migrările după pornirea MySQL

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Lipsește .env. Rulează: cp .env.example .env"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source <(sed 's/\r$//' .env)
set +a

CONTAINER="${MYSQL_CONTAINER:-hostera24-mysql}"

# shellcheck source=lib/dev-terminal.sh
source "$(dirname "$0")/lib/dev-terminal.sh"

echo "→ Pornesc MySQL (Docker)..."
if docker compose up -d mysql --wait; then
  echo "✓ MySQL rulează ($CONTAINER, port ${MYSQL_PORT:-3021})"
else
  echo "✗ MySQL nu a pornit. Verifică Docker Desktop."
  exit 1
fi

if [[ "${SKIP_MIGRATE:-}" != "1" ]]; then
  echo "→ Migrări DB (idempotente)..."
  bash "$ROOT/scripts/vps-migrate.sh"
fi

echo
echo "Pornesc backend și frontend în terminale separate..."
echo "  API: http://localhost:${PORT:-3022}"
echo "  WEB: http://localhost:${FRONTEND_PORT:-3023}"
echo

open_terminal "Hostera24 Backend" "$ROOT/backend-hostera24" "npm run start:dev"
sleep 0.4
open_terminal "Hostera24 Frontend" "$ROOT/frontend-hostera24" "npm run dev"

echo "Gata. MySQL în Docker; backend și frontend în ferestre noi."
echo "Oprești: Ctrl+C în fiecare terminal; opțional: docker compose stop mysql"
