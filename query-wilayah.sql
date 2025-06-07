-- Query untuk membaca wilayah prioritas dengan angka stunting lebih dari 20%
SELECT id_wilayah, nama_wilayah, angka_stunting
FROM wilayah
WHERE angka_stunting > 20
ORDER BY angka_stunting DESC;
