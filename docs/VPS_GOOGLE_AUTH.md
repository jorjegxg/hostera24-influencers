# Google Sign-In pe VPS

## 1. Firebase Console (o singură dată)

1. [Firebase Console](https://console.firebase.google.com/project/hostera24-f8585/authentication/providers) → **Authentication** → **Google** → **Enable**
2. **Project settings** → app Android `com.hostera24.hostera24` → adaugă **SHA-1**:
   - debug: vezi `docs/FIREBASE_CONSOLE_MANUAL.md`
   - release: SHA-1 din keystore-ul cu care semnezi APK-ul de producție

## 2. Service account pe server

Pe PC, din Firebase → **Project settings** → **Service accounts** → **Generate new private key**.

Copiază fișierul pe VPS (nu în git):

```bash
scp firebase-service-account.json user@IP_VPS:~/hostera24-influencers/
```

Fișierul trebuie să fie la: `~/hostera24-influencers/firebase-service-account.json`

## 3. `.env` pe VPS

```bash
ssh user@IP_VPS
cd ~/hostera24-influencers
nano .env
```

Asigură-te că ai (minim):

```env
FIREBASE_PROJECT_ID=hostera24-f8585

NEXT_PUBLIC_API_URL=https://api.hostera24.com
NEXT_PUBLIC_SITE_URL=https://hostera24.com
PUBLIC_UPLOADS_BASE_URL=https://api.hostera24.com/uploads

# Admin site — hash bcrypt; la Docker fiecare $ devine $$
ADMIN_PASSWORD_HASH=$$2b$$10$$uDsp0Lxgb50/ix94qEvrFO7Og0gTlP0hWOo/5TBA78nx3GFD4bA.W
```

Parolă implicită din exemplu: `123456`. Verifică în container:

```bash
docker compose exec api printenv ADMIN_PASSWORD_HASH | head -c 20
```

Trebuie să înceapă cu `$2b$10$`, nu gol și nu doar `b.W`.

`docker-compose` montează automat JSON-ul în container la `/app/firebase-service-account.json`.

## 4. Migrări MySQL (obligatoriu — fără ele: **500 Internal Server Error** la Google)

```bash
cd ~/hostera24-influencers
bash scripts/vps-migrate.sh
```

Sau manual:

```bash
docker compose exec -T mysql mysql -u hostera24 -p hostera24 \
  < backend-hostera24/docker/mysql/migrate-vps-safe.sql
```

## 5. Deploy / restart

```bash
cd ~/hostera24-influencers
git pull   # sau așteaptă GitHub Actions după push pe main
docker compose build web   # obligatoriu după schimbări NEXT_PUBLIC_* în .env
docker compose build api
docker compose up -d
```

Verifică că URL-ul API e în bundle-ul Next (altfel admin/contact din browser eșuează):

```bash
docker compose exec web sh -c "grep -r 'api.hostera24.com' .next/static 2>/dev/null | head -1"
```

Verifică logurile:

```bash
docker compose logs api --tail 30
```

Trebuie să vezi ceva de genul:

`Firebase Admin inițializat (service account)`

Dacă vezi `FIREBASE_PROJECT_ID lipsește` sau `Service account inexistent` → verifică `.env` și calea fișierului JSON.

## 6. Test rapid

```bash
curl -s -X POST https://api.hostera24.com/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken":"test"}'
```

- **400** `Token Firebase invalid` → backend OK, token de test e normal invalid
- **503** `Autentificarea Google nu este configurată` → lipsește `FIREBASE_PROJECT_ID` sau JSON-ul

## 7. App Flutter (producție)

```bash
flutter run \
  --dart-define=API_BASE_URL=https://api.hostera24.com \
  --dart-define=WEB_BASE_URL=https://hostera24.com
```

APK release: același `API_BASE_URL`; SHA-1 release în Firebase Console.

## Depanare

| Eroare | Cauză |
|--------|--------|
| Google nu e configurat pe server | `.env` fără `FIREBASE_PROJECT_ID` sau lipsește `firebase-service-account.json` pe VPS |
| Token invalid | SHA-1 greșit în Firebase, sau app nu e același proiect Firebase |
| `Cannot POST /auth/google` | Imagine Docker veche — `docker compose build api` |
