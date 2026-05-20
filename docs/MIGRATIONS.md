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
# sau, după chmod +x:
./scripts/vps-migrate.sh
```

## Local (Docker MySQL pornit)

```bash
docker compose up -d mysql
npm run db:migrate
```

## La deploy automat

Push pe `main` → GitHub Actions rulează migrarea după `docker compose up -d`.

## Reset complet (șterge TOT din DB!)

```bash
# Gol (fără conturi) — cere confirmare: scrie RESET
bash scripts/db-reset.sh

# Gol, fără confirmare
npm run db:reset

# Gol + conturi demo (cafe@demo.ro / password)
npm run db:reset:demo
# sau: bash scripts/db-reset.sh --demo
```

**Atenție:** șterge toate firmele, codurile QR și scanările. Pe **VPS/producție** folosește doar dacă știi ce faci.

Logo-urile din `uploads/` **nu** se șterg — doar MySQL.
