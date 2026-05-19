-- Schema Hostera24 (UTF-8 / utf8mb4)

SET NAMES utf8mb4;

-- Tabela firmelor (conturi)
CREATE TABLE firme (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    parola_hash VARCHAR(255) NOT NULL,
    creat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela codurilor QR (create de firme pentru fiecare postare)
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

-- Tabela scanărilor
CREATE TABLE scanari (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cod_qr_id INT NOT NULL,
    scanat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cod_qr_id) REFERENCES coduri_qr(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
