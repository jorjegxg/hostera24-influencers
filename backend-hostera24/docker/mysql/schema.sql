-- Schema Hostera24 (sursă unică — folosită la reset și la prima pornire Docker)

-- Tabela firmelor (conturi)
CREATE TABLE firme (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    parola_hash VARCHAR(255) NOT NULL,
    creat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela codurilor QR (create de firme pentru fiecare postare)
CREATE TABLE coduri_qr (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firma_id INT NOT NULL,
    cod VARCHAR(255) UNIQUE NOT NULL,
    nume_postare_clienti VARCHAR(255) NOT NULL,
    nume_postare_firme VARCHAR(255) NOT NULL,
    creat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (firma_id) REFERENCES firme(id) ON DELETE CASCADE
);

-- Tabela scanărilor
CREATE TABLE scanari (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cod_qr_id INT NOT NULL,
    scanat_la TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cod_qr_id) REFERENCES coduri_qr(id) ON DELETE CASCADE
);
