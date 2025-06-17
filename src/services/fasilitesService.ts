import supabase from "../helper/SupabaseClient";
import { PopUpFailitasKesehatan } from "../types";
export const getAllFasilitasBalita = async (): Promise<
  PopUpFailitasKesehatan[]
> => {
  const { data, error } = await supabase.rpc("get_fasilitas_balita");

  if (error) {
    console.error("Error fetching balita:", error.message);
    throw error;
  }

  console.log("Data fasilitas berhasil diambil:", data);

  const mappedData =
    data?.map((facility: { fasilitas_id: number; fasilitas_nama: string }) => ({
      ...facility,
      id: facility.fasilitas_id,
      nama: facility.fasilitas_nama,
    })) || [];

  console.log("Data fasilitas setelah mapping:", mappedData);
  console.log("Sample mapped facility:", mappedData[0]);

  return mappedData as PopUpFailitasKesehatan[];
};
