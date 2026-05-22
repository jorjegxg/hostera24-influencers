-- Migrare: limită opțională de scanări per cod QR
SET NAMES utf8mb4;

ALTER TABLE coduri_qr
  ADD COLUMN IF NOT EXISTS limita_scanari INT UNSIGNED NULL AFTER programare_zile;
