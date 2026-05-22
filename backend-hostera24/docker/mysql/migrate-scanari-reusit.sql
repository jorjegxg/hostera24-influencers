-- Migrare: marchează scanări reușite vs. respinse (ex. limită atinsă)
SET NAMES utf8mb4;

ALTER TABLE scanari
  ADD COLUMN IF NOT EXISTS reusit TINYINT(1) NOT NULL DEFAULT 1 AFTER cod_qr_id;
