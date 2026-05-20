-- Reset complet Hostera24 (UTF-8 / utf8mb4)
-- Parolă pentru conturile demo: password

SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS scanari, coduri_qr, firme;
SET FOREIGN_KEY_CHECKS = 1;

-- Tabela firmelor (conturi)
CREATE TABLE firme (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    firebase_uid VARCHAR(128) NULL UNIQUE,
    parola_hash VARCHAR(255) NULL,
    logo_url VARCHAR(512) NULL,
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

-- Date demo
INSERT INTO firme (id, email, parola_hash, logo_url) VALUES
(1, 'cafe@demo.ro', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://ui-avatars.com/api/?name=Cafe+Demo&background=10A37F&color=fff&size=256'),
(2, 'hotel@demo.ro', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://ui-avatars.com/api/?name=Hotel+Demo&background=10A37F&color=fff&size=256');

INSERT INTO coduri_qr (id, firma_id, cod, nume_postare_clienti, nume_postare_firme, pret_redus) VALUES
(1, 1, 'CAFE-INSTA-2026', 'Urmărește-ne pe Instagram', 'Campanie Instagram martie', 'Cafea la 15,99 lei'),
(2, 1, 'CAFE-GOOGLE-2026', 'Lasă-ne un review pe Google', 'Campanie Google Reviews', 'Desert gratuit la review'),
(3, 2, 'HOTEL-TIKTOK-2026', 'Urmărește hotelul pe TikTok', 'TikTok Q1', NULL);

INSERT INTO scanari (cod_qr_id, scanat_la) VALUES
(1, NOW() - INTERVAL 2 DAY),
(1, NOW() - INTERVAL 1 DAY),
(1, NOW() - INTERVAL 3 HOUR),
(2, NOW() - INTERVAL 5 HOUR),
(3, NOW() - INTERVAL 1 HOUR);
