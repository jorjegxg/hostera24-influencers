-- Migrare: preț serviciu/produs (text, opțional)
SET NAMES utf8mb4;

SET @db = DATABASE();

SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'coduri_qr' AND COLUMN_NAME = 'pret'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE coduri_qr ADD COLUMN pret VARCHAR(255) NULL AFTER nume_postare_firme',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
