import { create } from "zustand";
import { Balita } from "../types";
import {
  getAllBalita,
  addBalita,
  updateBalita,
  getBalitaById,
  deleteBalita,
} from "../services/balitaService";

interface ChildrenStore {
  children: Balita[];
  setChildren: (children: Balita[]) => void;
  getChildById: (id: string) => Promise<Balita | null>;
  addChild: (child: Omit<Balita, "id">) => Promise<void>;
  updateChild: (id: string, updatedData: Partial<Balita>) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;

  initializeFromSupabase: () => Promise<void>;
}

export const useChildrenStore = create<ChildrenStore>((set) => ({
  children: [],

  setChildren: (children: Balita[]) => set({ children }),

  getChildById: async (id: string) => {
    try {
      const balita = await getBalitaById(id);
      return balita;
    } catch (error) {
      console.error(`Gagal mengambil data balita dengan id ${id}:`, error);
      return null;
    }
  },

  addChild: async (child: Omit<Balita, "id">) => {
    try {
      const newChild = await addBalita(child as Balita);
      set((state) => ({
        children: [...state.children, newChild],
      }));
    } catch (error) {
      console.error("Gagal menambahkan balita:", error);
    }
  },

  updateChild: async (id: string, updatedData: Partial<Balita>) => {
    try {
      const updatedChild = await updateBalita(id, updatedData);
      set((state) => ({
        children: state.children.map((child) =>
          child.id === id ? updatedChild : child
        ),
      }));
    } catch (error) {
      console.error("Gagal mengupdate balita:", error);
    }
  },

  initializeFromSupabase: async () => {
    console.log("Mulai inisialisasi dari Supabase...");
    try {
      const data = await getAllBalita();
      console.log("Data berhasil diambil dari Supabase:", data);
      console.log("Jumlah data:", data?.length);
      set({ children: data });
      console.log("Store berhasil diupdate");
    } catch (err) {
      console.error("Gagal inisialisasi dari Supabase:", err);
    }
  },

  deleteChild: async (id: string) => {
    try {
      await deleteBalita(id);
      // Hapus dari state lokal
      set((state) => ({
        children: state.children.filter((child) => child.id !== id),
      }));
      console.log(`Balita dengan id ${id} berhasil dihapus dari store`);
    } catch (error) {
      console.error("Gagal menghapus balita:", error);
    }
  },
}));
