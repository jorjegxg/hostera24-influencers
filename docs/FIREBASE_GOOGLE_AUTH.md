# Autentificare Google cu Firebase (proiect `hostera24-f8585`)

## 0. FlutterFire (obligatoriu pentru app)

Într-un terminal, **loghează-te în Firebase** (o singură dată):

```bash
firebase login
```

Apoi configurează Flutter (din folderul `hostera24`):

```bash
cd hostera24
dart pub global activate flutterfire_cli
dart pub global run flutterfire_cli:flutterfire configure \
  --project=hostera24-f8585 \
  --yes \
  --platforms=android,ios \
  --android-package-name=com.hostera24.hostera24 \
  --overwrite-firebase-options
```

Sau din rădăcina monorepo:

```bash
bash scripts/flutterfire-configure.sh
```

Aceasta generează:

- `hostera24/lib/firebase_options.dart`
- `hostera24/android/app/google-services.json`
- `hostera24/ios/Runner/GoogleService-Info.plist` (dacă ai app iOS în Firebase)

## 1. Firebase Console

1. [Firebase Console](https://console.firebase.google.com/project/hostera24-f8585) → proiect **hostera24-f8585**
2. **Authentication** → **Sign-in method** → activează **Google**
3. Verifică app **Android** cu package `com.hostera24.hostera24` (sau adaug-o dacă lipsește)

### SHA-1 pentru Android (debug)

```bash
cd hostera24/android
./gradlew signingReport
```

Copiază SHA-1 (varianta `debug`) în Firebase → Project settings → aplicația Android.

### Web Client ID (pentru Google Sign-In pe Android)

În Firebase → **Project settings** → **Your apps** → sau Google Cloud Console → **OAuth 2.0 Client IDs** → client de tip **Web**.

Copiază ID-ul (ex. `123456-abc.apps.googleusercontent.com`) în `.env`:

```env
FIREBASE_WEB_CLIENT_ID=....apps.googleusercontent.com
```

## 2. Cont de serviciu (backend)

1. Firebase → **Project settings** → **Service accounts**
2. **Generate new private key** → salvează ca `firebase-service-account.json` la **rădăcina monorepo-ului**
3. Nu comite fișierul (e în `.gitignore`)

## 3. Variabile `.env` (rădăcina proiectului)

```env
# Backend
FIREBASE_PROJECT_ID=hostera24-f8585
FIREBASE_SERVICE_ACCOUNT_PATH=firebase-service-account.json

# Flutter — Web Client ID (obligatoriu pentru butonul Google pe Android)
FIREBASE_WEB_CLIENT_ID=....apps.googleusercontent.com
```

După `flutterfire configure`, **nu mai e nevoie** de `FIREBASE_API_KEY` / `FIREBASE_APP_ID` în `.env` pentru app (sunt în `firebase_options.dart`).

## 4. Migrare bază de date

```bash
docker compose exec -T mysql mysql -u hostera24 -p hostera24 < backend-hostera24/docker/mysql/migrate-firebase-auth.sql
```

## 5. Rulează aplicația

```bash
# Terminal 1 — backend
cd backend-hostera24 && npm run start:dev

# Terminal 2 — Flutter (rețea locală)
cd hostera24 && flutter run \
  --dart-define=API_BASE_URL=http://IP_PC:3022 \
  --dart-define=WEB_BASE_URL=http://IP_PC:3023
```

Butonul **Continuă cu Google** apare după `flutterfire configure` și când `FIREBASE_WEB_CLIENT_ID` e setat în `.env`.

## Flux

1. App: Google Sign-In → Firebase Auth → `idToken`
2. `POST /auth/google` cu `idToken`
3. Backend: Firebase Admin verifică token-ul → JWT aplicație

## Status configurare automată (proiect)

- `flutterfire configure` — de tine
- `.env` → `FIREBASE_PROJECT_ID=hostera24-f8585`
- Migrare DB `firebase_uid` — aplicată
- Backend verifică token fără service account (local) sau cu JSON (VPS)

**Tu în Console:** vezi [FIREBASE_CONSOLE_MANUAL.md](./FIREBASE_CONSOLE_MANUAL.md) (Google ON + SHA-1).

## Depanare

| Problemă | Soluție |
|----------|---------|
| `Found 0 Firebase projects` | `firebase login` |
| Butonul Google nu apare | Rulează `flutterfire configure` + setează `FIREBASE_WEB_CLIENT_ID` |
| `Autentificarea Google nu este configurată pe server` | `firebase-service-account.json` + `FIREBASE_PROJECT_ID` în `.env`, restart backend |
