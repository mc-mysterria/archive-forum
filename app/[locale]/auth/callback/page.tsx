'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

type AuthStatus = 'loading' | 'success' | 'error' | 'invalid_token'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuth()
  const t = useTranslations('auth')
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      const isPopup = searchParams.get('popup') === 'true'

      try {
        // Get token from URL parameters
        const token = searchParams.get('token')
        const returnUrl = searchParams.get('returnUrl') || '/'

        if (!token) {
          setStatus('invalid_token')
          setError(t('invalidTokenMessage'))

          // If in popup, notify parent of error
          if (isPopup && window.opener) {
            window.opener.postMessage({
              type: 'MYSTERRIA_AUTH_ERROR',
              error: t('invalidTokenMessage')
            }, '*')
          }
          return
        }

        // Decode JWT to get user info (basic decoding without verification)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))

          // Validate JWT has required fields
          if (!payload.sub) {
            throw new Error(t('invalidTokenMessage'))
          }

          // Extract user info from JWT payload (now includes username)
          const user = {
            id: payload.sub,
            username: payload.username || `User-${payload.sub.slice(0, 8)}`, // Use JWT username or fallback
            email: payload.email || undefined,
            permissions: payload.permissions || [],
          }

          // Store authentication data
          setAuth(token, user)

          // Also store in localStorage as fallback
          localStorage.setItem('access_token', token)

          setStatus('success')

          // Handle popup vs normal redirect
          if (isPopup && window.opener) {
            // In popup: notify parent and close popup
            window.opener.postMessage({
              type: 'MYSTERRIA_AUTH_SUCCESS',
              returnUrl: returnUrl
            }, '*')

            // Set a flag in localStorage to indicate auth completion
            try {
              localStorage.setItem('mysterria_auth_completed', Date.now().toString())
            } catch (e) {
              console.log('Could not set auth completion flag:', e)
            }

            // Close this popup after short delay
            setTimeout(() => {
              window.close()
            }, 1000)
          } else {
            // Normal redirect after a brief success message
            setTimeout(() => {
              router.replace(returnUrl)
            }, 2000)
          }

        } catch (decodeError) {
          console.error('Token decode error:', decodeError)
          setStatus('invalid_token')
          setError(t('invalidTokenMessage'))

          // If in popup, notify parent of error
          if (isPopup && window.opener) {
            window.opener.postMessage({
              type: 'MYSTERRIA_AUTH_ERROR',
              error: t('invalidTokenMessage')
            }, '*')
          }
        }

      } catch (err) {
        console.error('Auth callback error:', err)
        const errorMessage = err instanceof Error ? err.message : t('authFailed')
        setStatus('error')
        setError(errorMessage)

        // If in popup, notify parent of error
        if (isPopup && window.opener) {
          window.opener.postMessage({
            type: 'MYSTERRIA_AUTH_ERROR',
            error: errorMessage
          }, '*')
        }
      }
    }

    handleAuthCallback()
  }, [searchParams, setAuth, router])

  const handleReturnToLogin = () => {
    const returnUrl = searchParams.get('returnUrl') || '/'
    router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h3 className="text-lg font-semibold">{t('completing')}</h3>
              <p className="text-sm text-muted-foreground text-center">
                {t('completingMessage')}
              </p>
            </div>
          </>
        )

      case 'success':
        return (
          <>
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h3 className="text-lg font-semibold text-green-700">{t('authSuccessful')}</h3>
              <p className="text-sm text-muted-foreground text-center">
                {t('authSuccessMessage')}
              </p>
            </div>
          </>
        )

      case 'invalid_token':
        return (
          <>
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <h3 className="text-lg font-semibold text-orange-700">{t('invalidAuth')}</h3>
              <p className="text-sm text-muted-foreground text-center">
                {error || t('invalidTokenMessage')}
              </p>
              <Button onClick={handleReturnToLogin} className="mt-4">
                {t('tryAgain')}
              </Button>
            </div>
          </>
        )

      case 'error':
        return (
          <>
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <h3 className="text-lg font-semibold text-red-700">{t('authFailed')}</h3>
              <p className="text-sm text-muted-foreground text-center">
                {error || t('authFailed')}
              </p>
              <div className="flex space-x-2 mt-4">
                <Button onClick={handleReturnToLogin} variant="outline">
                  {t('tryAgain')}
                </Button>
                <Button onClick={handleGoHome}>
                  {t('goToArchive')}
                </Button>
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t('welcomeToArchive')}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  )
}