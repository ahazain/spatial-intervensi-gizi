import { create } from "zustand";
import { PopUpFailitasKesehatan, FasilitasKesehatan } from "../types";
import {
  getAllFasilitasBalita,
  createFasilitasKesehatan,
} from "../services/fasilitesService";

interface FacilitiesStore {
  facilities: PopUpFailitasKesehatan[];
  initializeFromSupabase: () => Promise<void>;
  addFacility: (fasilitas: Omit<FasilitasKesehatan, "id">) => Promise<void>;
}

export const useFacilitiesStore = create<FacilitiesStore>((set) => ({
  facilities: [],

  addFacility: async (fasilitas) => {
    try {
      await createFasilitasKesehatan(fasilitas);
      // Refresh list setelah tambah data baru
      const data = await getAllFasilitasBalita();
      set({ facilities: data });
    } catch (err) {
      console.error("Gagal menambahkan fasilitas:", err);
    }
  },

  initializeFromSupabase: async () => {
    console.log("Mulai inisialisasi fasilitas dari Supabase...");
    try {
      const data = await getAllFasilitasBalita();
      console.log("Data fasilitas berhasil diambil dari Supabase:", data);
      console.log("Jumlah data fasilitas:", data?.length);

      set({ facilities: data });

      console.log("Facilities store berhasil diupdate");
    } catch (err) {
      console.error("Gagal inisialisasi fasilitas dari Supabase:", err);
      set({ facilities: [] });
    }
  },
}));
