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
  type: "puskesmas" | "pustu" | "rumah sakit"; //union
  kecamatan_id: string;
  lokasi: GeoPoint;
  capacity: number;
}
export interface MapFilters {
  kecamatanList: string;
  showAreaKritis: boolean;
  showAreaRentan: boolean;
  showAreaTerkelola: boolean;
  showPuskesmas: boolean;
  showPustu: boolean;
}

//struktur data untuk view
export interface PopUpFailitasKesehatan {
  fasilitas_id: string;
  fasilitas_nama: string;
  kecamatan_id: string;
  kecamatan_nama: string;
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

export interface KecamatanRingkasan {
  kecamatan_id: string;
  kecamatan_nama: string;
  id: string; // alias untuk kecamatan_id
  nama: string; // alias untuk kecamatan_nama
  area: GeoPolygon;
  total_balita: number;
  jumlah_buruk: number;
  jumlah_stunting: number;
  total_penyakit: number;
  jumlah_faskes: number;
  nama_faskes: string[];
  area_kategori: "Kritis" | "Rentan" | "Terkelola";
}
