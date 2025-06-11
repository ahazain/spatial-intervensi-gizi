import supabase from "../helper/SupabaseClient";
import { PenyakitMenular } from "../types";
export const getAllPenyakitMenular = async (): Promise<PenyakitMenular[]> => {
  console.log("🔄 Mengambil data balita dari Supabase...");

  const { data, error } = await supabase.from("penyakit_menular").select("*");

  console.log("📡 Response dari Supabase:", { data, error });

  if (error) {
    console.error("Error fetching balita:", error.message);
    throw error;
  }

  console.log("Data balita berhasil diambil:", data);
  return data as PenyakitMenular[];
};
