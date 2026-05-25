-- Migrări idempotente (MySQL 5.7+ / MariaDB). Rulează de mai multe ori fără eroare.

SET NAMES utf8mb4;

SET @db = DATABASE();

-- firebase_uid
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'firme' AND COLUMN_NAME = 'firebase_uid'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE firme ADD COLUMN firebase_uid VARCHAR(128) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- parola_hash nullable (re-rulează mereu)
ALTER TABLE firme MODIFY COLUMN parola_hash VARCHAR(255) NULL;

-- nume
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'firme' AND COLUMN_NAME = 'nume'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE firme ADD COLUMN nume VARCHAR(255) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- telefon
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'firme' AND COLUMN_NAME = 'telefon'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE firme ADD COLUMN telefon VARCHAR(32) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- descriere
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'firme' AND COLUMN_NAME = 'descriere'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE firme ADD COLUMN descriere TEXT NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- website
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'firme' AND COLUMN_NAME = 'website'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE firme ADD COLUMN website VARCHAR(512) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- logo_url
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'firme' AND COLUMN_NAME = 'logo_url'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE firme ADD COLUMN logo_url VARCHAR(512) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- index unic firebase_uid
SET @idx_exists := (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = @db
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

-- preț serviciu/produs (coduri_qr.pret)
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'coduri_qr' AND COLUMN_NAME = 'pret'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE coduri_qr ADD COLUMN pret DECIMAL(10, 2) NULL AFTER nume_postare_firme',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- reducere în lei (fost pret_redus)
SET @col_reducere := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'coduri_qr' AND COLUMN_NAME = 'reducere'
);
SET @col_pret_redus := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'coduri_qr' AND COLUMN_NAME = 'pret_redus'
);
SET @sql := IF(
  @col_reducere = 0 AND @col_pret_redus > 0,
  'ALTER TABLE coduri_qr CHANGE COLUMN pret_redus reducere DECIMAL(10, 2) NULL',
  IF(
    @col_reducere = 0,
    'ALTER TABLE coduri_qr ADD COLUMN reducere DECIMAL(10, 2) NULL AFTER pret',
    'SELECT 1'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- conversie pret / reducere la DECIMAL (idempotent)
UPDATE coduri_qr
SET pret = NULL
WHERE pret IS NOT NULL
  AND CAST(pret AS CHAR) NOT REGEXP '^[0-9]+([.,][0-9]+)?$';

UPDATE coduri_qr
SET pret = REPLACE(CAST(pret AS CHAR), ',', '.')
WHERE pret IS NOT NULL;

UPDATE coduri_qr
SET reducere = NULL
WHERE reducere IS NOT NULL
  AND CAST(reducere AS CHAR) NOT REGEXP '^[0-9]+([.,][0-9]+)?$';

UPDATE coduri_qr
SET reducere = REPLACE(CAST(reducere AS CHAR), ',', '.')
WHERE reducere IS NOT NULL;

ALTER TABLE coduri_qr
  MODIFY COLUMN pret DECIMAL(10, 2) NULL,
  MODIFY COLUMN reducere DECIMAL(10, 2) NULL;

-- programare scan (coduri_qr)
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'coduri_qr' AND COLUMN_NAME = 'programare_tip'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE coduri_qr ADD COLUMN programare_tip VARCHAR(16) NULL AFTER reducere',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'coduri_qr' AND COLUMN_NAME = 'programare_de_la'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE coduri_qr ADD COLUMN programare_de_la DATE NULL AFTER programare_tip',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'coduri_qr' AND COLUMN_NAME = 'programare_pana_la'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE coduri_qr ADD COLUMN programare_pana_la DATE NULL AFTER programare_de_la',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'coduri_qr' AND COLUMN_NAME = 'programare_zile'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE coduri_qr ADD COLUMN programare_zile VARCHAR(32) NULL AFTER programare_pana_la',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- limită scanări (coduri_qr)
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'coduri_qr' AND COLUMN_NAME = 'limita_scanari'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE coduri_qr ADD COLUMN limita_scanari INT UNSIGNED NULL AFTER programare_zile',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- scanări reușite / respinse (scanari.reusit)
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'scanari' AND COLUMN_NAME = 'reusit'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE scanari ADD COLUMN reusit TINYINT(1) NOT NULL DEFAULT 1 AFTER cod_qr_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- scanări: doar Flutter creator consumă limita; pagina publică = statistici
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'scanari' AND COLUMN_NAME = 'contorizeaza_limita'
);
SET @sql := IF(
  @col_exists = 0,
  'ALTER TABLE scanari ADD COLUMN contorizeaza_limita TINYINT(1) NOT NULL DEFAULT 0 AFTER reusit',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- scanări vechi (înainte de separare) rămân la limită ca înainte
UPDATE scanari SET contorizeaza_limita = 1 WHERE reusit = 1 OR reusit = 0;

-- mesaje_contact (formular site)
CREATE TABLE IF NOT EXISTS mesaje_contact (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tip VARCHAR(32) NOT NULL,
    nume VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefon VARCHAR(32) NOT NULL,
    agentie VARCHAR(255) NULL,
    mesaj TEXT NULL,
    creat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
