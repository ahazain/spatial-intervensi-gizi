import { create } from "zustand";
import { Kecamatan } from "../types";
import { kecamatanList as mockKecamatanList } from "../lib/mockData";

interface KecamatanStore {
  kecamatanList: Kecamatan[];
  setKecamatanList: (kecamatanList: Kecamatan[]) => void;
  addKecamatan: (kecamatan: Kecamatan) => void;
  updateKecamatan: (id: string, updatedKecamatan: Partial<Kecamatan>) => void;
  deleteKecamatan: (id: string) => void;
  getKecamatanById: (id: string) => Kecamatan | undefined;
  initializeMockData: () => void;
}

export const useKecamatanStore = create<KecamatanStore>((set, get) => ({
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

  getKecamatanById: (id: string) =>
    get().kecamatanList.find((kecamatan) => kecamatan.id === id),

  initializeMockData: () => set({ kecamatanList: mockKecamatanList }),
}));
