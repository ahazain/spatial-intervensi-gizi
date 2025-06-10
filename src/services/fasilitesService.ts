import supabase from "../helper/SupabaseClient";
import { FasilitasKesehatan } from "../types";
export const getAllFasilitas = async (): Promise<FasilitasKesehatan[]> => {
  console.log("🔄 Mengambil data balita dari Supabase...");

  const { data, error } = await supabase
    .from("fasilitas_kesehatan")
    .select("*");

  console.log("📡 Response dari Supabase:", { data, error });

  if (error) {
    console.error("Error fetching balita:", error.message);
    throw error;
  }

  console.log("Data balita berhasil diambil:", data);
  return data as FasilitasKesehatan[];
};
