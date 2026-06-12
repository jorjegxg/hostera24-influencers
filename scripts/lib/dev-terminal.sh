# Deschidere terminale pentru development local.

is_windows() {
  [[ "${OSTYPE:-}" == msys* || "${OSTYPE:-}" == cygwin* || -n "${WINDIR:-}" ]]
}

to_win_path() {
  if command -v cygpath &>/dev/null; then
    cygpath -w "$1"
  else
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

  if is_windows; then
    local win_dir
    win_dir="$(to_win_path "$dir")"

    if command -v wt.exe &>/dev/null; then
      MSYS2_ARG_CONV_EXCL='*' wt.exe new-window -d "$win_dir" --title "$title" cmd /k "$cmd"
      return 0
    fi

    # cmd + start /D — evită path-uri MSYS și start+bash (stricat în Git Bash)
    MSYS2_ARG_CONV_EXCL='*' cmd.exe //c start "$title" /D "$win_dir" cmd //k "$cmd"
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
