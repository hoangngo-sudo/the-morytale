import { create } from 'zustand'
import api from '@/services/api'
import type { User } from '@/types/index' // Assuming User type exists or I need to define it

interface SocialState {
  friends: User[]
  pendingRequests: {
    received: User[]
    sent: User[]
  }
  searchResults: User[]
  isLoading: boolean
  error: string | null

  fetchFriends: () => Promise<void>
  fetchPendingRequests: () => Promise<void>
  searchUsers: (query: string) => Promise<void>
  sendFriendRequest: (userId: string) => Promise<void>
  acceptFriendRequest: (userId: string) => Promise<void>
  rejectFriendRequest: (userId: string) => Promise<void>
  removeFriend: (userId: string) => Promise<void>
}

export const useSocialStore = create<SocialState>((set) => ({
  friends: [],
  pendingRequests: { received: [], sent: [] },
  searchResults: [],
  isLoading: false,
  error: null,

  fetchFriends: async () => {
    set({ isLoading: true })
    try {
      const res = await api.client.get('/users/friends')
      set({ friends: res.data.friends || [] })
    } catch (err) {
      console.error('Fetch friends error', err)
      set({ error: 'Failed to fetch friends' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchPendingRequests: async () => {
    try {
      const res = await api.client.get('/users/requests')
      set({ pendingRequests: res.data })
    } catch (err) {
      console.error('Fetch requests error', err)
    }
  },

  searchUsers: async (query: string) => {
      // NOTE: We don't have a search endpoint yet in userController. 
      // For now, this will be a placeholder or we need to add it.
      // Assuming we adding a search endpoint or just mocking it for now?
      // actually, let's strictly stick to what we have. 
      // User didn't ask for search explicitly in the plan, but FriendsPage has "Find Friends".
      // I'll leave this empty or basic for now until I add the endpoint.
      console.warn("Search API not implemented yet")
  },

  sendFriendRequest: async (userId: string) => {
    try {
      await api.client.post(`/users/${userId}/request`)
      // Optimistic or refetch?
      // Refetch requests
      // get().fetchPendingRequests()
    } catch (err) {
      console.error('Send request error', err)
      throw err;
    }
  },

  acceptFriendRequest: async (userId: string) => {
     try {
      await api.client.post(`/users/requests/${userId}/accept`)
      // Refresh friends and requests
      // get().fetchFriends()
      // get().fetchPendingRequests()
    } catch (err) {
      console.error('Accept request error', err)
      throw err;
    }
  },

  rejectFriendRequest: async (userId: string) => {
     try {
      await api.client.delete(`/users/requests/${userId}`)
    } catch (err) {
      console.error('Reject request error', err)
      throw err;
    }
  },

  removeFriend: async (userId: string) => {
     try {
      await api.client.delete(`/users/${userId}/friend`)
       // Refresh
       // get().fetchFriends()
    } catch (err) {
       console.error('Remove friend error', err)
       throw err;
    }
  }
}))
