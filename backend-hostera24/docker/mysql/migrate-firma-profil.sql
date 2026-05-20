-- Detalii profil firmă

SET NAMES utf8mb4;

ALTER TABLE firme
  ADD COLUMN nume VARCHAR(255) NULL AFTER email;

ALTER TABLE firme
  ADD COLUMN telefon VARCHAR(32) NULL AFTER nume;

ALTER TABLE firme
  ADD COLUMN descriere TEXT NULL AFTER telefon;

ALTER TABLE firme
  ADD COLUMN website VARCHAR(512) NULL AFTER descriere;
