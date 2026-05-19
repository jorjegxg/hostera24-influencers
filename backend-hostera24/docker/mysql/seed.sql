-- Date demo (UTF-8 / utf8mb4) — parolă: password

SET NAMES utf8mb4;

INSERT INTO firme (id, email, parola_hash) VALUES
(1, 'cafe@demo.ro', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, 'hotel@demo.ro', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

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
