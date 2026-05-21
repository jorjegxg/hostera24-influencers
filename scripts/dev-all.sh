#!/usr/bin/env bash
# Pornește frontend, backend și Flutter în 3 terminale separate (development local).
#
#   bash scripts/dev-all.sh
#   npm run dev:all
#
# IP/porturi implicite din notite.txt — suprascrie cu variabile de mediu:
#   API_HOST=http://192.168.1.12:3022 WEB_HOST=http://192.168.1.12:3023 bash scripts/dev-all.sh
#
# Windows Terminal (opțional): WT=1 bash scripts/dev-all.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

API_HOST="${API_HOST:-http://192.168.1.12:3022}"
WEB_HOST="${WEB_HOST:-http://192.168.1.12:3023}"

FLUTTER_CMD="flutter run --dart-define=API_BASE_URL=${API_HOST} --dart-define=WEB_BASE_URL=${WEB_HOST}"

is_windows() {
  [[ "${OSTYPE:-}" == msys* || "${OSTYPE:-}" == cygwin* || -n "${WINDIR:-}" ]]
}

to_win_path() {
  if command -v cygpath &>/dev/null; then
    cygpath -w "$1"
  else
    # Git Bash: /c/Users/... -> C:\Users\...
    local p="$1"
    if [[ "$p" =~ ^/([a-zA-Z])/(.*)$ ]]; then
      printf '%s:\\%s' "${BASH_REMATCH[1]^^}" "${BASH_REMATCH[2]//\//\\}"
    else
      printf '%s' "$p"
    fi
  fi
}

open_terminal() {
  local title="$1"
  local dir="$2"
  local cmd="$3"

  if is_windows && [[ "${WT:-}" != "1" ]]; then
    # Git Bash: ferestre separate (fără wt — ";" din -c rupe wt.exe)
    local bash_exe
    bash_exe="$(command -v bash || echo bash)"
    MSYS2_ARG_CONV_EXCL='*' start "$title" "$bash_exe" --login -i -c "cd '$dir' && $cmd; exec bash -i"
    return 0
  fi

  if is_windows && [[ "${WT:-}" == "1" ]] && command -v wt.exe &>/dev/null; then
    local win_dir
    win_dir="$(to_win_path "$dir")"
    # cmd /k — fără ";" în argumentele wt
    wt.exe new-window -d "$dir" --title "$title" cmd /k "cd /d \"$win_dir\" && $cmd"
    return 0
  fi

  if command -v wt.exe &>/dev/null && ! is_windows; then
    wt.exe new-window -d "$dir" --title "$title" bash -lc "$cmd; exec bash"
    return 0
  fi

  if command -v gnome-terminal &>/dev/null; then
    gnome-terminal --title="$title" -- bash -lc "cd '$dir' && $cmd; exec bash"
    return 0
  fi

  if command -v open &>/dev/null && [[ "$(uname -s)" == Darwin ]]; then
    osascript -e "tell application \"Terminal\" to do script \"cd '$dir' && $cmd\""
    return 0
  fi

  echo "Nu s-a găsit terminal. Rulează manual în: $dir"
  echo "  $cmd"
  return 1
}

echo "Pornesc 3 terminale (backend → frontend → flutter)..."
echo "  API: $API_HOST"
echo "  WEB: $WEB_HOST"
echo

open_terminal "Hostera24 Backend" "$ROOT/backend-hostera24" "npm run start:dev"
sleep 0.4
open_terminal "Hostera24 Frontend" "$ROOT/frontend-hostera24" "npm run dev"
sleep 0.4
open_terminal "Hostera24 Flutter" "$ROOT/hostera24" "$FLUTTER_CMD"

echo "Gata. Închide fiecare terminal când oprești serviciul respectiv."
