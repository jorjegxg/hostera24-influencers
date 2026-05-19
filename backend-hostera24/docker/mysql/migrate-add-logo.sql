-- Migrare: logo firmă
SET NAMES utf8mb4;

ALTER TABLE firme
  ADD COLUMN IF NOT EXISTS logo_url VARCHAR(512) NULL AFTER parola_hash;
