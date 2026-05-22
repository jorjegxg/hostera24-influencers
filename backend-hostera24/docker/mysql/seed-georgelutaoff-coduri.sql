-- UN SINGUR statement. DBeaver: selecteaza tot, Execute Statement (Ctrl+Enter).
-- Contul georgelutaoff@gmail.com trebuie sa existe in firme.

INSERT IGNORE INTO coduri_qr (
  firma_id,
  cod,
  nume_postare_clienti,
  nume_postare_firme,
  pret_redus,
  programare_tip,
  programare_de_la,
  programare_pana_la,
  sters
)
SELECT
  f.id,
  'GEORGE-INSTA-2026',
  'Urmareste-ne pe Instagram',
  'Campanie Instagram',
  'Reducere 20%',
  NULL,
  NULL,
  NULL,
  0
FROM firme f
WHERE f.email = 'georgelutaoff@gmail.com'
UNION ALL
SELECT
  f.id,
  'GEORGE-TIKTOK-2026',
  'Urmareste-ne pe TikTok',
  'TikTok Q2',
  'Cafea gratuita',
  NULL,
  NULL,
  NULL,
  0
FROM firme f
WHERE f.email = 'georgelutaoff@gmail.com'
UNION ALL
SELECT
  f.id,
  'GEORGE-GOOGLE-2026',
  'Review Google',
  'Google Reviews',
  'Desert gratuit',
  'interval',
  DATE_SUB(CURDATE(), INTERVAL 7 DAY),
  DATE_ADD(CURDATE(), INTERVAL 60 DAY),
  0
FROM firme f
WHERE f.email = 'georgelutaoff@gmail.com';
