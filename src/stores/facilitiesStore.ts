import { create } from "zustand";
import { PopUpFailitasKesehatan, FasilitasKesehatan } from "../types";
import {
  getAllFasilitasBalita,
  createFasilitasKesehatan,
  updateFasilitasKesehatan,
  getFasilitasById,
} from "../services/fasilitesService";

interface FacilitiesStore {
  facilities: PopUpFailitasKesehatan[];
  selectedFacility: FasilitasKesehatan | null;
  initializeFromSupabase: () => Promise<void>;
  addFacility: (fasilitas: Omit<FasilitasKesehatan, "id">) => Promise<void>;
  updateFacility: (
    id: string,
    data: Partial<Omit<FasilitasKesehatan, "id">>
  ) => Promise<void>;
  getFacilityById: (id: string) => Promise<void>;
}

export const useFacilitiesStore = create<FacilitiesStore>((set) => ({
  facilities: [],
  selectedFacility: null,

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
  getFacilityById: async (id) => {
    try {
      const detail = await getFasilitasById(id);
      if (detail) {
        set({ selectedFacility: detail });
      } else {
        set({ selectedFacility: null });
      }
    } catch (err) {
      console.error("Gagal mengambil data fasilitas berdasarkan ID:", err);
      set({ selectedFacility: null });
    }
  },
  updateFacility: async (id, data) => {
    try {
      await updateFasilitasKesehatan(id, data);
      const updatedList = await getAllFasilitasBalita();
      set({ facilities: updatedList });
    } catch (err) {
      console.error("Gagal mengupdate fasilitas:", err);
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
