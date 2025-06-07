import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL and API key must be set in environment variables."
  );
}
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Types untuk TypeScript
export interface Database {
  public: {
    Tables: {
      kecamatan: {
        Row: {
          id_kecamatan: number;
          nama_kecamatan: string;
          geo_batas: any; // PostGIS GEOMETRY type
        };
        Insert: {
          id_kecamatan?: number;
          nama_kecamatan: string;
          geo_batas?: any;
        };
        Update: {
          id_kecamatan?: number;
          nama_kecamatan?: string;
          geo_batas?: any;
        };
      };
      balita: {
        Row: {
          id_balita: number;
          nama: string | null;
          tanggal_lahir: string | null;
          jenis_kelamin: string | null;
          status_gizi: string | null;
          id_kecamatan: number | null;
          lokasi: any; // PostGIS GEOMETRY type
        };
        Insert: {
          id_balita?: number;
          nama?: string;
          tanggal_lahir?: string;
          jenis_kelamin?: string;
          status_gizi?: string;
          id_kecamatan?: number;
          lokasi?: any;
        };
        Update: {
          id_balita?: number;
          nama?: string;
          tanggal_lahir?: string;
          jenis_kelamin?: string;
          status_gizi?: string;
          id_kecamatan?: number;
          lokasi?: any;
        };
      };
      fasilitas_kesehatan: {
        Row: {
          id_faskes: number;
          nama_faskes: string | null;
          jenis_faskes: string | null;
          alamat: string | null;
          id_kecamatan: number | null;
          lokasi: any; // PostGIS GEOMETRY type
        };
        Insert: {
          id_faskes?: number;
          nama_faskes?: string;
          jenis_faskes?: string;
          alamat?: string;
          id_kecamatan?: number;
          lokasi?: any;
        };
        Update: {
          id_faskes?: number;
          nama_faskes?: string;
          jenis_faskes?: string;
          alamat?: string;
          id_kecamatan?: number;
          lokasi?: any;
        };
      };
      user_admin: {
        Row: {
          id_user: number;
          username: string;
          password_hash: string;
          role: string;
        };
        Insert: {
          id_user?: number;
          username: string;
          password_hash: string;
          role?: string;
        };
        Update: {
          id_user?: number;
          username?: string;
          password_hash?: string;
          role?: string;
        };
      };
    };
  };
}
