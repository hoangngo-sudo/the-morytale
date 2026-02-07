import { create } from 'zustand'
import api from '@/services/api.ts'
import type { User } from '@/types/index.ts'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string) => Promise<boolean>
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

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
    set({ isLoading: true })
    try {
      const response = await api.getMe()
      set({ user: response.data, isAuthenticated: true })
    } catch (error) {
      console.error('Failed to fetch user', error)
      localStorage.removeItem('cutting-room:token')
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },
}))
