import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  username: string
  email?: string
  permissions: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  // Actions
  setAuth: (token: string, user: User) => void
  logout: () => void
  hasPermission: (permission: string) => boolean

  // Archive-specific permission helpers
  canRead: () => boolean
  canWrite: () => boolean
  canModerate: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },

      hasPermission: (permission: string) => {
        const { user } = get()
        return user?.permissions?.includes(permission) ?? false
      },

      // Archive-specific permission helpers
      canRead: () => {
        const { hasPermission } = get()
        return hasPermission('PERM_ARCHIVE:READ') || true // GET endpoints are public
      },

      canWrite: () => {
        const { hasPermission } = get()
        return hasPermission('PERM_ARCHIVE:WRITE')
      },

      canModerate: () => {
        const { hasPermission } = get()
        return hasPermission('PERM_ARCHIVE:MODERATE')
      },

    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)