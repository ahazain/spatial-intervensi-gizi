import supabase from "../helper/SupabaseClient";
import { Kecamatan } from "../types";
export const getAllKecamatan = async (): Promise<Kecamatan[]> => {
  console.log("🔄 Mengambil data balita dari Supabase...");

  const { data, error } = await supabase.from("kecamatan").select("*");

  console.log("📡 Response dari Supabase:", { data, error });

  if (error) {
    console.error("Error fetching balita:", error.message);
    throw error;
  }

  console.log("Data balita berhasil diambil:", data);
  return data as Kecamatan[];
};
