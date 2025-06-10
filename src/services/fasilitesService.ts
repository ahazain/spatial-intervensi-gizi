import supabase from "../helper/SupabaseClient";
import { PopUpFailitasKesehatan } from "../types";
export const getAllFasilitasBalita = async (): Promise<PopUpFailitasKesehatan[]> => {
  const { data, error } = await supabase.rpc("get_fasilitas_balita");

  if (error) {
    console.error("Error fetching balita:", error.message);
    throw error;
  }

  console.log("Data balita berhasil diambil:", data);
  return data as PopUpFailitasKesehatan[];
};
