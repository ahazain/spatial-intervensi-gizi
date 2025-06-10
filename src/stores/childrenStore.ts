import { create } from "zustand";
import { Balita } from "../types";
import { getAllBalita } from "../services/balitaService";

interface ChildrenStore {
  children: Balita[];
  setChildren: (children: Balita[]) => void;
  addChild: (child: Balita) => void;
  updateChild: (id: string, updatedChild: Partial<Balita>) => void;
  deleteChild: (id: string) => void;
  getChildById: (id: string) => Balita | undefined;
  initializeFromSupabase: () => Promise<void>;
}

export const useChildrenStore = create<ChildrenStore>((set, get) => ({
  children: [],

  setChildren: (children: Balita[]) => set({ children }),

  addChild: (child: Balita) =>
    set((state) => ({
      children: [...state.children, child],
    })),

  updateChild: (id: string, updatedChild: Partial<Balita>) =>
    set((state) => ({
      children: state.children.map((child) =>
        child.id === id ? { ...child, ...updatedChild } : child
      ),
    })),

  deleteChild: (id: string) =>
    set((state) => ({
      children: state.children.filter((child) => child.id !== id),
    })),

  getChildById: (id: string) => get().children.find((child) => child.id === id),
  initializeFromSupabase: async () => {
    console.log("🔄 Mulai inisialisasi dari Supabase...");
    try {
      const data = await getAllBalita();
      console.log("✅ Data berhasil diambil dari Supabase:", data);
      console.log("📊 Jumlah data:", data?.length);
      set({ children: data });
      console.log("✅ Store berhasil diupdate");
    } catch (err) {
      console.error("❌ Gagal inisialisasi dari Supabase:", err);
    }
  },
}));
