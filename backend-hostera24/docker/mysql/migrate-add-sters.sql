-- Rulează o singură dată dacă baza există deja fără coloana `sters`:
-- docker exec -i hostera24-mysql mysql -uUSER -pPASS hostera24 < backend-hostera24/docker/mysql/migrate-add-sters.sql

SET NAMES utf8mb4;

ALTER TABLE coduri_qr
  ADD COLUMN IF NOT EXISTS sters TINYINT(1) NOT NULL DEFAULT 0 AFTER nume_postare_firme;
