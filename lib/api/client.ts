import { useAuthStore } from '@/lib/store/auth-store'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Token getter function that works in both client and server contexts
function getToken(): string | null {
  if (typeof window === 'undefined') {
    // Server-side - token would need to be passed via headers or other means
    return null
  }

  // Client-side - get from zustand store or fallback to localStorage
  try {
    const token = useAuthStore.getState().token
    if (token) return token

    // Fallback to direct localStorage access
    return localStorage.getItem('access_token') ||
           sessionStorage.getItem('access_token')
  } catch {
    return localStorage.getItem('access_token') ||
           sessionStorage.getItem('access_token')
  }
}

function handleAuthenticationError() {
  if (typeof window === 'undefined') return

  // Clear stored tokens
  localStorage.removeItem('access_token')
  sessionStorage.removeItem('access_token')

  // Clear auth store
  useAuthStore.getState().logout()

  // Redirect to login or handle as needed
  // For now, just log the error - frontend can implement specific logic
  console.warn('Authentication required. Please log in.')
}

export async function fetcher<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const token = getToken()

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    // Add existing headers if any
    if (options?.headers) {
        const existingHeaders = options.headers
        if (existingHeaders instanceof Headers) {
            existingHeaders.forEach((value, key) => {
                headers[key] = value
            })
        } else if (Array.isArray(existingHeaders)) {
            existingHeaders.forEach(([key, value]) => {
                headers[key] = value
            })
        } else {
            Object.assign(headers, existingHeaders)
        }
    }

    // Add JWT token if available
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (response.status === 401) {
        handleAuthenticationError()
        throw new Error('Authentication required. Please log in.')
    }

    if (response.status === 403) {
        throw new Error('You do not have permission to perform this action.')
    }

    if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
    }

    if (!response.ok) {
        const errorMessage = await response.text().catch(() => 'Unknown error')
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorMessage}`)
    }

    return response.json()
}