import { create } from "zustand";
import { PenyakitMenular } from "../types";
import { getAllPenyakitMenular } from "../services/fasilitesService";
interface PenyakitMenularStore {
  penyakitMenularList: PenyakitMenular[];
  setPenyakitMenularList: (penyakitMenularList: PenyakitMenular[]) => void;
  addPenyakitMenular: (penyakitMenular: PenyakitMenular) => void;
  updatePenyakitMenular: (
    id: string,
    updatedPenyakitMenular: Partial<PenyakitMenular>
  ) => void;
  deletePenyakitMenular: (id: string) => void;
  getPenyakitMenularById: (id: string) => PenyakitMenular | undefined;
  getPenyakitMenularByKecamatan: (kecamatanId: string) => PenyakitMenular[];
  getTotalPenyakitMenularByKecamatan: (kecamatanId: string) => number;
  initializeFromSupabase: () => void;
}

export const usePenyakitMenularStore = create<PenyakitMenularStore>(
  (set, get) => ({
    penyakitMenularList: [],

    setPenyakitMenularList: (penyakitMenularList: PenyakitMenular[]) =>
      set({ penyakitMenularList }),

    addPenyakitMenular: (penyakitMenular: PenyakitMenular) =>
      set((state) => ({
        penyakitMenularList: [...state.penyakitMenularList, penyakitMenular],
      })),

    updatePenyakitMenular: (
      id: string,
      updatedPenyakitMenular: Partial<PenyakitMenular>
    ) =>
      set((state) => ({
        penyakitMenularList: state.penyakitMenularList.map((penyakit) =>
          penyakit.id === id
            ? { ...penyakit, ...updatedPenyakitMenular }
            : penyakit
        ),
      })),

    deletePenyakitMenular: (id: string) =>
      set((state) => ({
        penyakitMenularList: state.penyakitMenularList.filter(
          (penyakit) => penyakit.id !== id
        ),
      })),

    getPenyakitMenularById: (id: string) =>
      get().penyakitMenularList.find((penyakit) => penyakit.id === id),

    getPenyakitMenularByKecamatan: (kecamatanId: string) =>
      get().penyakitMenularList.filter(
        (penyakit) => penyakit.kecamatan_id === kecamatanId
      ),

    getTotalPenyakitMenularByKecamatan: (kecamatanId: string) =>
      get()
        .penyakitMenularList.filter(
          (penyakit) => penyakit.kecamatan_id === kecamatanId
        )
        .reduce((total, penyakit) => total + penyakit.jumlah, 0),
    initializeFromSupabase: async () => {
      console.log(" Mulai inisialisasi dari Supabase...");
      try {
        const data = await getAllPenyakitMenular();
        console.log(" Data berhasil diambil dari Supabase:", data);
        console.log("Jumlah data:", data?.length);
        set({ penyakitMenularList: data });
        console.log("Store berhasil diupdate");
      } catch (err) {
        console.error(" Gagal inisialisasi dari Supabase:", err);
      }
    },
  })
);
