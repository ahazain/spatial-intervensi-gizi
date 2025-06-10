import supabase from "../helper/SupabaseClient";
import { Balita } from "../types";
export const getAllBalita = async (): Promise<Balita[]> => {
  console.log("🔄 Mengambil data balita dari Supabase...");

  const { data, error } = await supabase.from("balita").select("*");

  console.log("📡 Response dari Supabase:", { data, error });

  if (error) {
    console.error("❌ Error fetching balita:", error.message);
    throw error;
  }

  console.log("✅ Data balita berhasil diambil:", data);
  return data as Balita[];
};
