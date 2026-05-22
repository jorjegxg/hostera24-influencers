-- Date demo (UTF-8 / utf8mb4) — parolă: password

SET NAMES utf8mb4;

INSERT INTO firme (id, email, parola_hash, logo_url) VALUES
(1, 'cafe@demo.ro', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://ui-avatars.com/api/?name=Cafe+Demo&background=10A37F&color=fff&size=256'),
(2, 'hotel@demo.ro', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://ui-avatars.com/api/?name=Hotel+Demo&background=10A37F&color=fff&size=256');

INSERT INTO coduri_qr (id, firma_id, cod, nume_postare_clienti, nume_postare_firme, pret_redus) VALUES
(1, 1, 'CAFE-INSTA-2026', 'Urmărește-ne pe Instagram', 'Campanie Instagram martie', 'Cafea la 15,99 lei'),
(2, 1, 'CAFE-GOOGLE-2026', 'Lasă-ne un review pe Google', 'Campanie Google Reviews', 'Desert gratuit la review'),
(3, 2, 'HOTEL-TIKTOK-2026', 'Urmărește hotelul pe TikTok', 'TikTok Q1', NULL);

-- Scanări demo pentru statistici (ultimele ~28 zile, ore variate)

-- CAFE-INSTA (cod 1): 4 scanări/zi × 28 zile
INSERT INTO scanari (cod_qr_id, scanat_la)
WITH RECURSIVE days AS (
  SELECT 0 AS d
  UNION ALL
  SELECT d + 1 FROM days WHERE d < 27
),
slots AS (
  SELECT 2 AS oh
  UNION ALL SELECT 9
  UNION ALL SELECT 14
  UNION ALL SELECT 19
)
SELECT 1, NOW() - INTERVAL (d * 24 + oh) HOUR
FROM days
CROSS JOIN slots;

-- CAFE-INSTA: vârf la prânz (ora ~12) în ultimele 21 zile
INSERT INTO scanari (cod_qr_id, scanat_la)
WITH RECURSIVE days AS (
  SELECT 0 AS d
  UNION ALL
  SELECT d + 1 FROM days WHERE d < 20
)
SELECT 1, NOW() - INTERVAL (d * 24 + 12) HOUR
FROM days;

-- CAFE-INSTA: câteva scanări în weekend-uri (zile 6, 13, 20, 27 înapoi)
INSERT INTO scanari (cod_qr_id, scanat_la)
SELECT 1, NOW() - INTERVAL (d * 24 + 17) HOUR
FROM (
  SELECT 6 AS d
  UNION ALL SELECT 13
  UNION ALL SELECT 20
  UNION ALL SELECT 27
) AS weekend_days;

-- CAFE-GOOGLE (cod 2): 3 scanări/zi × 14 zile
INSERT INTO scanari (cod_qr_id, scanat_la)
WITH RECURSIVE days AS (
  SELECT 0 AS d
  UNION ALL
  SELECT d + 1 FROM days WHERE d < 13
),
slots AS (
  SELECT 6 AS oh
  UNION ALL SELECT 11
  UNION ALL SELECT 16
)
SELECT 2, NOW() - INTERVAL (d * 24 + oh) HOUR
FROM days
CROSS JOIN slots;

-- HOTEL-TIKTOK (cod 3): 2 scanări/zi × 10 zile
INSERT INTO scanari (cod_qr_id, scanat_la)
WITH RECURSIVE days AS (
  SELECT 0 AS d
  UNION ALL
  SELECT d + 1 FROM days WHERE d < 9
),
slots AS (
  SELECT 10 AS oh
  UNION ALL SELECT 18
)
SELECT 3, NOW() - INTERVAL (d * 24 + oh) HOUR
FROM days
CROSS JOIN slots;
