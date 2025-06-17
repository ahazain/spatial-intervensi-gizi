import supabase from "../helper/SupabaseClient";
import { KecamatanRingkasan } from "../types";

export const getAllKecamatanPopUp = async (): Promise<KecamatanRingkasan[]> => {
  const { data, error } = await supabase.rpc("get_ringkasan_kecamatan");

  if (error) {
    console.error("Error fetching balita:", error.message);
    throw error;
  }

  console.log("Data balita berhasil diambil:", data);
  return data as KecamatanRingkasan[];
};
