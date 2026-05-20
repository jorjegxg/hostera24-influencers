#!/usr/bin/env bash
# Configurează Firebase / FlutterFire pentru proiectul hostera24-f8585.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/hostera24"

echo "→ Verifică autentificarea Firebase (firebase login dacă e nevoie)..."
firebase projects:list --project hostera24-f8585 >/dev/null 2>&1 || {
  echo "Rulează mai întâi: firebase login"
  exit 1
}

dart pub global activate flutterfire_cli

dart pub global run flutterfire_cli:flutterfire configure \
  --project=hostera24-f8585 \
  --yes \
  --platforms=android,ios \
  --android-package-name=com.hostera24.hostera24 \
  --overwrite-firebase-options

echo ""
echo "✓ Gata. Adaugă în ../.env:"
echo "  FIREBASE_PROJECT_ID=hostera24-f8585"
echo "  FIREBASE_SERVICE_ACCOUNT_PATH=firebase-service-account.json"
echo "  FIREBASE_WEB_CLIENT_ID=<Web client ID din Firebase Console>"
echo ""
echo "Apoi: restart backend + flutter run"
