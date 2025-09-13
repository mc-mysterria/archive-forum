'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  requiredPermission,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, hasPermission } = useAuth()

  // Not authenticated
  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to access this page.
            </p>
            <Link href="/login">
              <Button>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      )
    )
  }

  // Authenticated but missing required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have the required permissions to access this page.
          </p>
          <p className="text-sm text-muted-foreground">
            Required permission: <code className="bg-muted px-2 py-1 rounded">{requiredPermission}</code>
          </p>
        </div>
      </div>
    )
  }

  // Authenticated and has required permission (or no permission required)
  return <>{children}</>
}