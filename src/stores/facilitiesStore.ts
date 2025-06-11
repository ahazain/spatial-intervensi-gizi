import { create } from "zustand";
import { PopUpFailitasKesehatan } from "../types";
import { getAllFasilitasBalita } from "../services/fasilitesService";

interface FacilitiesStore {
  facilities: PopUpFailitasKesehatan[];
  initializeFromSupabase: () => Promise<void>;
}

export const useFacilitiesStore = create<FacilitiesStore>((set) => ({
  facilities: [],

  initializeFromSupabase: async () => {
    console.log(" Mulai inisialisasi fasilitas dari Supabase...");
    try {
      const data = await getAllFasilitasBalita();
      console.log(" Data fasilitas berhasil diambil dari Supabase:", data);
      console.log(" Jumlah data fasilitas:", data?.length);
      set({ facilities: data || [] });
      console.log("Facilities store berhasil diupdate");
    } catch (err) {
      console.error("Gagal inisialisasi fasilitas dari Supabase:", err);
      set({ facilities: [] });
    }
  },
}));
