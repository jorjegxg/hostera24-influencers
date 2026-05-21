-- Mesaje formular contact site (public)

SET NAMES utf8mb4;

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
