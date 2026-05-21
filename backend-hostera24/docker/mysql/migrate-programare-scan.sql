-- Migrare: programare când poate fi scanat codul QR
SET NAMES utf8mb4;

ALTER TABLE coduri_qr
  ADD COLUMN IF NOT EXISTS programare_tip VARCHAR(16) NULL AFTER pret_redus,
  ADD COLUMN IF NOT EXISTS programare_de_la DATE NULL AFTER programare_tip,
  ADD COLUMN IF NOT EXISTS programare_pana_la DATE NULL AFTER programare_de_la,
  ADD COLUMN IF NOT EXISTS programare_zile VARCHAR(32) NULL AFTER programare_pana_la;
