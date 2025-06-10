import { create } from "zustand";
import { FasilitasKesehatan } from "../types";
import { fasilitasKesehatanList as mockFacilities } from "../lib/mockData";

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
  initializeMockData: () => void;
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

  initializeMockData: () => set({ facilities: mockFacilities }),
}));
