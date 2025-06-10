import { create } from "zustand";
import { FasilitasKesehatan } from "../types";
import { getAllFasilitas } from "../services/fasilitesService";

interface FacilitiesStore {
  facilities: FasilitasKesehatan[];
  setFacilities: (facilities: FasilitasKesehatan[]) => void;
  addFacility: (facility: FasilitasKesehatan) => void;
  updateFacility: (
    id: string,
    updatedFacility: Partial<FasilitasKesehatan>
  ) => void;
  deleteFacility: (id: string) => void;
  getFacilityById: (id: string) => FasilitasKesehatan | undefined;
  initializeFromSupabase: () => void;
}

export const useFacilitiesStore = create<FacilitiesStore>((set, get) => ({
  facilities: [],

  setFacilities: (facilities: FasilitasKesehatan[]) => set({ facilities }),

  addFacility: (facility: FasilitasKesehatan) =>
    set((state) => ({
      facilities: [...state.facilities, facility],
    })),

  updateFacility: (id: string, updatedFacility: Partial<FasilitasKesehatan>) =>
    set((state) => ({
      facilities: state.facilities.map((facility) =>
        facility.id === id ? { ...facility, ...updatedFacility } : facility
      ),
    })),

  deleteFacility: (id: string) =>
    set((state) => ({
      facilities: state.facilities.filter((facility) => facility.id !== id),
    })),

  getFacilityById: (id: string) =>
    get().facilities.find((facility) => facility.id === id),

  initializeFromSupabase: async () => {
    console.log(" Mulai inisialisasi dari Supabase...");
    try {
      const data = await getAllFasilitas();
      console.log(" Data berhasil diambil dari Supabase:", data);
      console.log("Jumlah data:", data?.length);
      set({ facilities: data });
      console.log("Store berhasil diupdate");
    } catch (err) {
      console.error(" Gagal inisialisasi dari Supabase:", err);
    }
  },
}));
