-- Migrare: câmpuri opționale + mesaj preț redus (text)
SET NAMES utf8mb4;

ALTER TABLE coduri_qr
  MODIFY COLUMN nume_postare_clienti VARCHAR(255) NULL,
  MODIFY COLUMN nume_postare_firme VARCHAR(255) NULL;

ALTER TABLE coduri_qr
  ADD COLUMN IF NOT EXISTS pret_redus VARCHAR(255) NULL AFTER nume_postare_firme;

-- Dacă coloana există deja ca DECIMAL, convertește la text:
ALTER TABLE coduri_qr
  MODIFY COLUMN pret_redus VARCHAR(255) NULL;
