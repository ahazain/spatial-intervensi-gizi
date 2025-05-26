import { create } from 'zustand';
import { Child, NutritionStatus } from '../types';
import { mockChildren } from '../lib/mockData';

interface ChildrenState {
  children: Child[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchChildren: () => Promise<void>;
  addChild: (child: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Child>;
  updateChild: (id: string, data: Partial<Omit<Child, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Child>;
  deleteChild: (id: string) => Promise<boolean>;
  getChildById: (id: string) => Child | undefined;
  getChildrenByDistrict: (district: string) => Child[];
  getChildrenByStatus: (status: NutritionStatus) => Child[];
}

export const useChildrenStore = create<ChildrenState>((set, get) => ({
  children: [],
  loading: false,
  error: null,

  fetchChildren: async () => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Using timeout to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ children: mockChildren, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch children data', loading: false });
    }
  },

  addChild: async (childData) => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newChild: Child = {
        ...childData,
        id: `child-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({ 
        children: [...state.children, newChild],
        loading: false
      }));
      
      return newChild;
    } catch (error) {
      set({ error: 'Failed to add child', loading: false });
      throw error;
    }
  },

  updateChild: async (id, data) => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedChild: Child | undefined;
      
      set(state => {
        const updatedChildren = state.children.map(child => {
          if (child.id === id) {
            updatedChild = {
              ...child,
              ...data,
              updatedAt: new Date().toISOString()
            };
            return updatedChild;
          }
          return child;
        });
        
        return {
          children: updatedChildren,
          loading: false
        };
      });
      
      if (!updatedChild) {
        throw new Error('Child not found');
      }
      
      return updatedChild;
    } catch (error) {
      set({ error: 'Failed to update child', loading: false });
      throw error;
    }
  },

  deleteChild: async (id) => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        children: state.children.filter(child => child.id !== id),
        loading: false
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Failed to delete child', loading: false });
      return false;
    }
  },

  getChildById: (id) => {
    return get().children.find(child => child.id === id);
  },

  getChildrenByDistrict: (district) => {
    return get().children.filter(child => child.district === district);
  },

  getChildrenByStatus: (status) => {
    return get().children.filter(child => child.nutritionStatus === status);
  }
}));