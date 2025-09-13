import { useAuthStore } from '@/lib/store/auth-store'

export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
    hasPermission,
    canRead,
    canWrite,
    canModerate,
  } = useAuthStore()

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
    hasPermission,
    // Archive-specific permissions
    canRead,
    canWrite,
    canModerate,
  }
}