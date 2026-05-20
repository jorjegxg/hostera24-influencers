# Migrări bază de date

Fișier unic, **idempotent** (poți rula de câte ori vrei):

`backend-hostera24/docker/mysql/migrate-vps-safe.sql`

Adaugă: `firebase_uid`, `nume`, `telefon`, `descriere`, `website`, `logo_url`, `parola_hash` nullable.

## Pe VPS (recomandat)

```bash
cd ~/hostera24-influencers
git pull
npm run db:migrate
```

Echivalent:

```bash
bash scripts/vps-migrate.sh
```

## Local (Docker MySQL pornit)

```bash
docker compose up -d mysql
npm run db:migrate
```

## La deploy automat

Push pe `main` → GitHub Actions rulează migrarea după `docker compose up -d`.

## Reset complet (șterge datele!)

```bash
npm run db:reset
```

Doar development — **nu** pe producție dacă vrei să păstrezi conturile.
