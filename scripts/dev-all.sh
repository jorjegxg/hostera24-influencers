#!/usr/bin/env bash
# Alias pentru dev-stack (MySQL + backend + frontend, fără Flutter).
#
#   bash scripts/dev-all.sh
#   npm run dev:all

set -euo pipefail
exec "$(dirname "$0")/dev-stack.sh" "$@"
