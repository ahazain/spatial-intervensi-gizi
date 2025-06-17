import supabase from "../helper/SupabaseClient";
import { Balita } from "../types";
export const getAllBalita = async (): Promise<Balita[]> => {
  console.log("Mengambil data balita dari Supabase...");

  const { data, error } = await supabase.from("balita").select("*");

  console.log("Response dari Supabase:", { data, error });

  if (error) {
    console.error("Error fetching balita:", error.message);
    throw error;
  }

  console.log("Data balita berhasil diambil:", data);
  return data as Balita[];
};

export const getBalitaById = async (id: string): Promise<Balita> => {
  console.log(`Mengambil data balita dengan id: ${id} dari Supabase...`);

  const { data, error } = await supabase
    .from("balita")
    .select("*")
    .eq("id", id)
    .single(); // Mengambil hanya satu baris data

  console.log("Response dari Supabase:", { data, error });

  if (error) {
    console.error("Error fetching balita by id:", error.message);
    throw error;
  }

  if (!data) {
    throw new Error(`Data balita dengan id ${id} tidak ditemukan.`);
  }

  console.log("Data balita berhasil diambil:", data);
  return data as Balita;
};

export const addBalita = async (newBalita: Balita): Promise<Balita> => {
  const { data, error } = await supabase
    .from("balita")
    .insert([newBalita])
    .select();

  if (error) {
    console.error("Error adding balita:", error.message);
    throw error;
  }

  if (data && data.length > 0) {
    return data[0] as Balita;
  } else {
    throw new Error(
      "Data yang dikembalikan dari Supabase adalah null atau kosong."
    );
  }
};
export const updateBalita = async (
  id: string,
  updatedBalita: Partial<Balita>
): Promise<Balita> => {
  const { data, error } = await supabase
    .from("balita")
    .update(updatedBalita)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating balita:", error.message);
    throw error;
  }

  if (data && data.length > 0) {
    return data[0] as Balita;
  } else {
    throw new Error("Update gagal: data kosong setelah update.");
  }
};
export const deleteBalita = async (id: string): Promise<void> => {
  const { error } = await supabase.from("balita").delete().eq("id", id);

  if (error) {
    console.error("Error deleting balita:", error.message);
    throw error;
  }

  console.log(`Data balita dengan id ${id} berhasil dihapus.`);
};
