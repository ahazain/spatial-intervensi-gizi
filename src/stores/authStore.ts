import { create } from 'zustand';
import { User, UserRole } from '../types';
import { mockUsers } from '../lib/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  role: null,

  login: async (email: string, password: string) => {
    // In a real app, this would make an API call
    // For this demo, we're using mock data and simple logic
    
    // For demo purposes, any password works with existing email
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      set({ user, isAuthenticated: true, role: user.role });
      return true;
    }
    
    return false;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false, role: null });
  }
}));

// Helper hook for checking permissions
export const usePermissions = () => {
  const { role } = useAuthStore();
  
  return {
    canViewDashboard: role === 'admin' || role === 'officer',
    canAddChild: role === 'admin' || role === 'officer',
    canEditChild: role === 'admin' || role === 'officer',
    canDeleteChild: role === 'admin',
    canAddFacility: role === 'admin',
    canEditFacility: role === 'admin',
    canDeleteFacility: role === 'admin',
    canViewAnalytics: role === 'admin' || role === 'officer',
  };
};