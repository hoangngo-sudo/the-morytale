import { create } from 'zustand'
import type { User } from '@/types/index.ts'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (token: string) => Promise<boolean>
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (token: string) => {
    localStorage.setItem('cutting-room:token', token);
    try {
        await useAuthStore.getState().fetchUser();
        return true;
    } catch {
        localStorage.removeItem('cutting-room:token');
        set({ user: null, isAuthenticated: false });
        return false;
    }
  },

  logout: () => {
    localStorage.removeItem('cutting-room:token');
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const { default: api } = await import('../services/api');
      const response = await api.get('/auth/me');
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // If 401, logout
      set({ user: null, isAuthenticated: false });
      localStorage.removeItem('cutting-room:token');
    }
  }
}))
