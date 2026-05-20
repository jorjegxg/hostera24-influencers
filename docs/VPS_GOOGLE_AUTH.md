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
```

`docker-compose` montează automat JSON-ul în container la `/app/firebase-service-account.json`.

## 4. Migrări MySQL (dacă nu le-ai rulat)

```bash
cd ~/hostera24-influencers

docker compose exec -T mysql mysql -u hostera24 -p"$MYSQL_PASSWORD" hostera24 \
  < backend-hostera24/docker/mysql/migrate-firebase-auth.sql

docker compose exec -T mysql mysql -u hostera24 -p"$MYSQL_PASSWORD" hostera24 \
  < backend-hostera24/docker/mysql/migrate-firma-profil.sql
```

(Înlocuiește parola sau folosește `-p` interactiv.)

## 5. Deploy / restart

```bash
cd ~/hostera24-influencers
git pull   # sau așteaptă GitHub Actions după push pe main
docker compose build api
docker compose up -d
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
