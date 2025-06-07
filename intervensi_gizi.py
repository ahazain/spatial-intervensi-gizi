import psycopg2
import pandas as pd

# Koneksi ke database
conn = psycopg2.connect(
    host="localhost",
    database="intervensi_gizi",
    user="postgres",
    password="admin"
)

# Buat cursor
cursor = conn.cursor()

# --- QUERY 1: Wilayah Prioritas (Analisis Spasial)
query_wilayah = """
SELECT kecamatan, jumlah_stunting, ST_AsGeoJSON(geom) as geometry
FROM kecamatan
ORDER BY jumlah_stunting DESC
LIMIT 5;
"""

df_wilayah = pd.read_sql(query_wilayah, conn)
print("Wilayah Prioritas:")
print(df_wilayah)

# --- QUERY 2: Statistik Agregat
query_statistik = """
SELECT
    (SELECT COUNT(*) FROM balita) AS total_balita,
    (SELECT COUNT(*) FROM faskes) AS total_faskes,
    (SELECT COUNT(*) FROM kecamatan) AS total_kecamatan,
    (SELECT SUM(jumlah_stunting) FROM kecamatan) AS total_stunting;
"""

df_statistik = pd.read_sql(query_statistik, conn)
print("\nStatistik Agregat:")
print(df_statistik)

# Tutup koneksi
cursor.close()
conn.close()
