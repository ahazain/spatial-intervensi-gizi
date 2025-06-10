export interface User {
  id_user: string;
  username: string;
  password_hash: string;
  email: string;
}

export interface PenyakitMenular {
  id: string;
  nama:
    | "difteri"
    | "pertusis"
    | "tetanus neonaterum"
    | "hepatitis B"
    | "suspek campak";
  jumlah: number;
  kecamatan_id: string;
}

export interface Kecamatan {
  id: string;
  nama: string;
  area: GeoPolygon;
  riskLevel: "rawan" | "perlu-diperhatikan" | "aman";
}
export interface GeoPolygon {
  type: "Polygon";
  coordinates: number[][][];
}
export interface Balita {
  id: string;
  nama: string;
  status_nutrisi: "normal" | "buruk" | "kurang" | "stunting";
  fasilitas_kesehatan_id: string;
}
export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
}
export interface FasilitasKesehatan {
  id: string;
  nama: string;
  type: "puskesmas" | "pustu"; //union
  Kecamatan_id: string;
  lokasi: GeoPoint;
  capacity: number;
}
export interface MapFilters {
  kecamatanList: string;
  showAreaRawan: boolean;
  showAreaPerluDiperhatikan: boolean;
  showAreaAman: boolean;
  showPuskesmas: boolean;
  showPustu: boolean;
  showPenyakitMenular: boolean;
}

//struktur data untuk view
export interface PopUpFailitasKesehatan {
  fasilitas_id: string;
  fasilitas_nama: string;
  type: string;
  capacity: number;
  total_balita: number;
  jumlah_normal: number;
  jumlah_kurang: number;
  jumlah_buruk: number;
  jumlah_stunting: number;
  lokasi: {
    type: "Point";
    coordinates: [number, number];
  };
}
