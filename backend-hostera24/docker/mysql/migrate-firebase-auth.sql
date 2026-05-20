-- Autentificare Google (Firebase): UID + parolă opțională

SET NAMES utf8mb4;

-- Rulează o singură dată. Dacă firebase_uid există deja, ignoră prima linie.
ALTER TABLE firme
  ADD COLUMN firebase_uid VARCHAR(128) NULL UNIQUE AFTER email;

ALTER TABLE firme
  MODIFY COLUMN parola_hash VARCHAR(255) NULL;
