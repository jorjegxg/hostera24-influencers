-- Migrări idempotente pentru VPS (MySQL 8+). Rulează de mai multe ori fără eroare.

SET NAMES utf8mb4;

ALTER TABLE firme
  ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128) NULL AFTER email;

ALTER TABLE firme
  MODIFY COLUMN parola_hash VARCHAR(255) NULL;

ALTER TABLE firme
  ADD COLUMN IF NOT EXISTS nume VARCHAR(255) NULL AFTER email;

ALTER TABLE firme
  ADD COLUMN IF NOT EXISTS telefon VARCHAR(32) NULL AFTER nume;

ALTER TABLE firme
  ADD COLUMN IF NOT EXISTS descriere TEXT NULL AFTER telefon;

ALTER TABLE firme
  ADD COLUMN IF NOT EXISTS website VARCHAR(512) NULL AFTER descriere;

ALTER TABLE firme
  ADD COLUMN IF NOT EXISTS logo_url VARCHAR(512) NULL AFTER website;

-- Index unic pe firebase_uid (dacă lipsește)
SET @idx_exists := (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'firme'
    AND index_name = 'firebase_uid'
);
SET @sql := IF(
  @idx_exists = 0,
  'ALTER TABLE firme ADD UNIQUE INDEX firebase_uid (firebase_uid)',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
