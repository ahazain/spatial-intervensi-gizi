import { create } from "zustand";
import { Kecamatan } from "../types";
import { getAllKecamatan } from "../services/kecamatanService";

interface KecamatanStore {
  kecamatanList: Kecamatan[];
  setKecamatanList: (kecamatanList: Kecamatan[]) => void;
  addKecamatan: (kecamatan: Kecamatan) => void;
  updateKecamatan: (id: string, updatedKecamatan: Partial<Kecamatan>) => void;
  deleteKecamatan: (id: string) => void;
  initializeFromSupabase: () => void;
}

export const useKecamatanStore = create<KecamatanStore>((set) => ({
  kecamatanList: [],

  setKecamatanList: (kecamatanList: Kecamatan[]) => set({ kecamatanList }),

  addKecamatan: (kecamatan: Kecamatan) =>
    set((state) => ({
      kecamatanList: [...state.kecamatanList, kecamatan],
    })),

  updateKecamatan: (id: string, updatedKecamatan: Partial<Kecamatan>) =>
    set((state) => ({
      kecamatanList: state.kecamatanList.map((kecamatan) =>
        kecamatan.id === id ? { ...kecamatan, ...updatedKecamatan } : kecamatan
      ),
    })),

  deleteKecamatan: (id: string) =>
    set((state) => ({
      kecamatanList: state.kecamatanList.filter(
        (kecamatan) => kecamatan.id !== id
      ),
    })),

  initializeFromSupabase: async () => {
    console.log(" Mulai inisialisasi dari Supabase...");
    try {
      const data = await getAllKecamatan();
      console.log(" Data berhasil diambil dari Supabase:", data);
      console.log("Jumlah data:", data?.length);
      set({ kecamatanList: data });
      console.log("Store berhasil diupdate");
    } catch (err) {
      console.error(" Gagal inisialisasi dari Supabase:", err);
    }
  },
}));
