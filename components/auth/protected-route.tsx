'use client'

import { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const t = useTranslations('auth')

  // Not authenticated
  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">{t('authenticationRequired')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('pleaseLoginToAccess')}
            </p>
            <Link href={`/login?returnUrl=${encodeURIComponent(pathname)}`}>
              <Button>
                <LogIn className="h-4 w-4 mr-2" />
                {t('login')}
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
          <h2 className="text-2xl font-bold mb-4">{t('accessDenied')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('noPermissionToAccess')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('requiredPermission')}: <code className="bg-muted px-2 py-1 rounded">{requiredPermission}</code>
          </p>
        </div>
      </div>
    )
  }

  // Authenticated and has required permission (or no permission required)
  return <>{children}</>
}