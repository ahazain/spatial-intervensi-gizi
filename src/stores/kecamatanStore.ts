import { create } from "zustand";
import { KecamatanRingkasan } from "../types";
import { getAllKecamatanPopUp } from "../services/kecamatanService";

interface KecamatanStore {
  kecamatanList: KecamatanRingkasan[];
  initializeFromSupabase: () => void;
}

export const useKecamatanStore = create<KecamatanStore>((set) => ({
  kecamatanList: [],

  initializeFromSupabase: async () => {
    try {
      const data = await getAllKecamatanPopUp();

      set({ kecamatanList: data });
    } catch (err) {
      console.error(" Gagal inisialisasi dari Supabase:", err);
    }
  },
}));
