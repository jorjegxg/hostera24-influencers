-- Reset complet Hostera24: șterge toate tabelele și recreează schema curentă (de la 0).
-- După reset: bash scripts/db-reset.sh --demo  (date demo)
-- Scriptul db-reset.sh aplică și migrate-vps-safe.sql (idempotent).

SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS scanari, coduri_qr, mesaje_contact, firme;
SET FOREIGN_KEY_CHECKS = 1;

-- Tabela firmelor (conturi)
CREATE TABLE firme (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    nume VARCHAR(255) NULL,
    telefon VARCHAR(32) NULL,
    descriere TEXT NULL,
    website VARCHAR(512) NULL,
    firebase_uid VARCHAR(128) NULL UNIQUE,
    parola_hash VARCHAR(255) NULL,
    logo_url VARCHAR(512) NULL,
    creat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela codurilor QR
CREATE TABLE coduri_qr (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firma_id INT NOT NULL,
    cod VARCHAR(255) UNIQUE NOT NULL,
    nume_postare_clienti VARCHAR(255) NULL,
    nume_postare_firme VARCHAR(255) NULL,
    pret_redus VARCHAR(255) NULL,
    programare_tip VARCHAR(16) NULL,
    programare_de_la DATE NULL,
    programare_pana_la DATE NULL,
    programare_zile VARCHAR(32) NULL,
    sters TINYINT(1) NOT NULL DEFAULT 0,
    creat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (firma_id) REFERENCES firme(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela scanărilor
CREATE TABLE scanari (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cod_qr_id INT NOT NULL,
    scanat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cod_qr_id) REFERENCES coduri_qr(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mesaje formular contact site
CREATE TABLE mesaje_contact (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tip VARCHAR(32) NOT NULL,
    nume VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefon VARCHAR(32) NOT NULL,
    agentie VARCHAR(255) NULL,
    mesaj TEXT NULL,
    creat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
