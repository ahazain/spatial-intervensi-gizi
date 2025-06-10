import { create } from "zustand";
import { Balita } from "../types";
import { balitaList as mockChildren } from "../lib/mockData";

interface ChildrenStore {
  children: Balita[];
  setChildren: (children: Balita[]) => void;
  addChild: (child: Balita) => void;
  updateChild: (id: string, updatedChild: Partial<Balita>) => void;
  deleteChild: (id: string) => void;
  getChildById: (id: string) => Balita | undefined;
  initializeMockData: () => void;
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

  initializeMockData: () => set({ children: mockChildren }),
}));
