SELECT f.id, f.email, c.cod, COUNT(s.id) AS numar_scanari
FROM firme f
LEFT JOIN coduri_qr c ON c.firma_id = f.id AND c.cod LIKE 'GEORGE-%'
LEFT JOIN scanari s ON s.cod_qr_id = c.id
WHERE f.email = 'georgelutaoff@gmail.com'
GROUP BY f.id, f.email, c.id, c.cod;
