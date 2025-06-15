import supabase from "../helper/SupabaseClient";
import { MapFilters } from "../types";
export const getMaps = async (): Promise<MapFilters[]> => {
  const { data, error } = await supabase.rpc("get_map_filtered");

  if (error) {
    console.error("Error fetching :", error.message);
    throw error;
  }

  console.log("Data  berhasil diambil:", data);
  return data as MapFilters[];
};
