-- Query untuk agregasi data total balita, fasilitas kesehatan, dan stunting per kecamatan
SELECT 
  k.nama_kecamatan,
  COALESCE(SUM(b.jumlah_balita), 0) AS total_balita,
  COALESCE(COUNT(f.id_faskes), 0) AS total_faskes,
  COALESCE(SUM(s.jumlah_stunting), 0) AS total_stunting
FROM kecamatan k
LEFT JOIN balita b ON k.id_kecamatan = b.id_kecamatan
LEFT JOIN faskes f ON k.id_kecamatan = f.id_kecamatan
LEFT JOIN stunting s ON k.id_kecamatan = s.id_kecamatan
GROUP BY k.nama_kecamatan
ORDER BY total_stunting DESC;
