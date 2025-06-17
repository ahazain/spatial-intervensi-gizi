import supabase from "../helper/SupabaseClient";
import { PopUpFailitasKesehatan, FasilitasKesehatan } from "../types";
export const getAllFasilitasBalita = async (): Promise<
  PopUpFailitasKesehatan[]
> => {
  const { data, error } = await supabase.rpc("get_fasilitas_balita");

  if (error) {
    console.error("Error fetching balita:", error.message);
    throw error;
  }

  console.log("Data fasilitas berhasil diambil:", data);

  return data as PopUpFailitasKesehatan[];
};

export const getFasilitasById = async (
  id: number
): Promise<FasilitasKesehatan | null> => {
  const { data, error } = await supabase
    .from("fasilitas_kesehatan")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Gagal mengambil fasilitas by ID:", error.message);
    return null;
  }

  return data as FasilitasKesehatan;
};

export const createFasilitasKesehatan = async (
  fasilitas: Omit<FasilitasKesehatan, "id">
): Promise<void> => {
  const { error } = await supabase
    .from("fasilitas_kesehatan")
    .insert([fasilitas]);

  if (error) {
    console.error("Gagal menambahkan fasilitas:", error.message);
    throw error;
  }

  console.log("Fasilitas berhasil ditambahkan:", fasilitas);
};

export const updateFasilitasKesehatan = async (
  id: number,
  updatedData: Partial<Omit<FasilitasKesehatan, "id">>
): Promise<void> => {
  const { error } = await supabase
    .from("fasilitas_kesehatan")
    .update(updatedData)
    .eq("id", id);

  if (error) {
    console.error("Gagal mengupdate fasilitas:", error.message);
    throw error;
  }

  console.log("Fasilitas berhasil diupdate:", { id, ...updatedData });
};
