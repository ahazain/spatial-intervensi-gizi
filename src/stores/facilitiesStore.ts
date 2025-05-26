import { create } from 'zustand';
import { HealthFacility } from '../types';
import { mockHealthFacilities } from '../lib/mockData';

interface FacilitiesState {
  facilities: HealthFacility[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchFacilities: () => Promise<void>;
  addFacility: (facility: Omit<HealthFacility, 'id' | 'createdAt' | 'updatedAt'>) => Promise<HealthFacility>;
  updateFacility: (id: string, data: Partial<Omit<HealthFacility, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<HealthFacility>;
  deleteFacility: (id: string) => Promise<boolean>;
  getFacilityById: (id: string) => HealthFacility | undefined;
  getFacilitiesByDistrict: (district: string) => HealthFacility[];
  getFacilitiesByType: (type: 'puskesmas' | 'pustu') => HealthFacility[];
}

export const useFacilitiesStore = create<FacilitiesState>((set, get) => ({
  facilities: [],
  loading: false,
  error: null,

  fetchFacilities: async () => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Using timeout to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ facilities: mockHealthFacilities, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch facilities data', loading: false });
    }
  },

  addFacility: async (facilityData) => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newFacility: HealthFacility = {
        ...facilityData,
        id: `facility-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({ 
        facilities: [...state.facilities, newFacility],
        loading: false
      }));
      
      return newFacility;
    } catch (error) {
      set({ error: 'Failed to add facility', loading: false });
      throw error;
    }
  },

  updateFacility: async (id, data) => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedFacility: HealthFacility | undefined;
      
      set(state => {
        const updatedFacilities = state.facilities.map(facility => {
          if (facility.id === id) {
            updatedFacility = {
              ...facility,
              ...data,
              updatedAt: new Date().toISOString()
            };
            return updatedFacility;
          }
          return facility;
        });
        
        return {
          facilities: updatedFacilities,
          loading: false
        };
      });
      
      if (!updatedFacility) {
        throw new Error('Facility not found');
      }
      
      return updatedFacility;
    } catch (error) {
      set({ error: 'Failed to update facility', loading: false });
      throw error;
    }
  },

  deleteFacility: async (id) => {
    set({ loading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        facilities: state.facilities.filter(facility => facility.id !== id),
        loading: false
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Failed to delete facility', loading: false });
      return false;
    }
  },

  getFacilityById: (id) => {
    return get().facilities.find(facility => facility.id === id);
  },

  getFacilitiesByDistrict: (district) => {
    return get().facilities.filter(facility => facility.district === district);
  },

  getFacilitiesByType: (type) => {
    return get().facilities.filter(facility => facility.type === type);
  }
}));