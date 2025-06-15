import { create } from "zustand";
import { MapFilters } from "../types";
import { getMaps } from "../services/mapService";

interface MapStore {
  MapList: MapFilters[];
  initializeFromSupabase: () => void;
}

export const useKecamatanStore = create<MapStore>((set) => ({
  MapList: [],

  initializeFromSupabase: async () => {
    try {
      const data = await getMaps();

      set({ MapList: data });
    } catch (err) {
      console.error(" Gagal inisialisasi dari Supabase:", err);
    }
  },
}));
