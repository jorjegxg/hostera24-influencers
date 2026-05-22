#!/usr/bin/env bash
# Resetează COMPLET baza de date (DROP tabele + schema nouă).
#
# Utilizare:
#   bash scripts/db-reset.sh              # gol, cere confirmare
#   bash scripts/db-reset.sh --yes        # gol, fără confirmare
#   bash scripts/db-reset.sh --demo       # gol + conturi/coduri demo (parolă: password)
#   bash scripts/db-reset.sh --yes --demo
#
# npm: npm run db:reset | npm run db:reset:demo

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

WITH_DEMO=false
SKIP_CONFIRM=false

for arg in "$@"; do
  case "$arg" in
    --demo) WITH_DEMO=true ;;
    --yes|-y) SKIP_CONFIRM=true ;;
    -h|--help)
      sed -n '2,10p' "$0"
      exit 0
      ;;
    *)
      echo "Argument necunoscut: $arg (folosește --help)"
      exit 1
      ;;
  esac
done

if [[ ! -f .env ]]; then
  echo "Lipsește .env. Rulează: cp .env.example .env"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

CONTAINER="${MYSQL_CONTAINER:-hostera24-mysql}"
RESET_SQL="$ROOT/backend-hostera24/docker/mysql/reset.sql"
MIGRATE_SQL="$ROOT/backend-hostera24/docker/mysql/migrate-vps-safe.sql"
SEED_SQL="$ROOT/backend-hostera24/docker/mysql/seed.sql"

if [[ ! -f "$RESET_SQL" ]]; then
  echo "Lipsește $RESET_SQL"
  exit 1
fi

if [[ ! -f "$MIGRATE_SQL" ]]; then
  echo "Lipsește $MIGRATE_SQL"
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "Containerul $CONTAINER nu rulează. Pornește-l:"
  echo "  docker compose up -d mysql"
  exit 1
fi

echo "⚠️  RESET COMPLET baza de date: $MYSQL_DATABASE (container: $CONTAINER)"
echo "    Se șterg TOATE firmele, codurile QR și scanările."
if [[ "$WITH_DEMO" == true ]]; then
  echo "    După reset se încarcă date demo (cafe@demo.ro / password)."
else
  echo "    Baza va fi GOALĂ (fără conturi)."
fi

if [[ "$SKIP_CONFIRM" != true ]]; then
  read -r -p "Scrie RESET pentru a continua: " confirm
  if [[ "$confirm" != "RESET" ]]; then
    echo "Anulat."
    exit 0
  fi
fi

echo "→ Aplic reset.sql (schema completă de la 0)..."
docker exec -i "$CONTAINER" mysql \
  --default-character-set=utf8mb4 \
  -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" \
  "$MYSQL_DATABASE" < "$RESET_SQL"

echo "→ Aplic migrate-vps-safe.sql (migrări idempotente)..."
docker exec -i "$CONTAINER" mysql \
  --default-character-set=utf8mb4 \
  -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" \
  "$MYSQL_DATABASE" < "$MIGRATE_SQL"

if [[ "$WITH_DEMO" == true ]]; then
  echo "→ Aplic seed.sql (demo)..."
  docker exec -i "$CONTAINER" mysql \
    --default-character-set=utf8mb4 \
    -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" \
    "$MYSQL_DATABASE" < "$SEED_SQL"
  echo "✓ Reset complet + date demo. Login demo: cafe@demo.ro / password"
else
  echo "✓ Reset complet. Baza e goală — înregistrează cont nou în app."
fi
