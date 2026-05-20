-- Reset complet Hostera24: șterge toate tabelele și recreează schema (fără date).
-- Pentru date demo după reset: bash scripts/db-reset.sh --demo

SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS scanari, coduri_qr, firme;
SET FOREIGN_KEY_CHECKS = 1;

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

CREATE TABLE coduri_qr (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firma_id INT NOT NULL,
    cod VARCHAR(255) UNIQUE NOT NULL,
    nume_postare_clienti VARCHAR(255) NULL,
    nume_postare_firme VARCHAR(255) NULL,
    pret_redus VARCHAR(255) NULL,
    sters TINYINT(1) NOT NULL DEFAULT 0,
    creat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (firma_id) REFERENCES firme(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE scanari (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cod_qr_id INT NOT NULL,
    scanat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cod_qr_id) REFERENCES coduri_qr(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
