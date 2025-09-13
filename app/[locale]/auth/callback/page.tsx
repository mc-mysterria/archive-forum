'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

type AuthStatus = 'loading' | 'success' | 'error' | 'invalid_token'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuth()
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get token from URL parameters
        const token = searchParams.get('token')
        const returnUrl = searchParams.get('returnUrl') || '/'

        if (!token) {
          setStatus('invalid_token')
          setError('No authentication token received')
          return
        }

        // Decode JWT to get user info (basic decoding without verification)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))

          // Create user object from JWT payload
          const user = {
            id: payload.sub || payload.userId || payload.id,
            username: payload.username || payload.name || payload.email,
            email: payload.email,
            permissions: payload.permissions || payload.roles || [],
          }

          // Validate required fields
          if (!user.id || !user.username) {
            throw new Error('Invalid token payload: missing user information')
          }

          // Store authentication data
          setAuth(token, user)

          // Also store in localStorage as fallback
          localStorage.setItem('access_token', token)

          setStatus('success')

          // Redirect after a brief success message
          setTimeout(() => {
            router.replace(returnUrl)
          }, 2000)

        } catch (decodeError) {
          console.error('Token decode error:', decodeError)
          setStatus('invalid_token')
          setError('Invalid token format')
        }

      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Authentication failed')
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
              <h3 className="text-lg font-semibold">Completing Authentication</h3>
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we verify your credentials...
              </p>
            </div>
          </>
        )

      case 'success':
        return (
          <>
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h3 className="text-lg font-semibold text-green-700">Authentication Successful!</h3>
              <p className="text-sm text-muted-foreground text-center">
                Welcome back! You&apos;ll be redirected shortly...
              </p>
            </div>
          </>
        )

      case 'invalid_token':
        return (
          <>
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <h3 className="text-lg font-semibold text-orange-700">Invalid Authentication</h3>
              <p className="text-sm text-muted-foreground text-center">
                {error || 'The authentication token is invalid or expired.'}
              </p>
              <Button onClick={handleReturnToLogin} className="mt-4">
                Try Again
              </Button>
            </div>
          </>
        )

      case 'error':
        return (
          <>
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <h3 className="text-lg font-semibold text-red-700">Authentication Failed</h3>
              <p className="text-sm text-muted-foreground text-center">
                {error || 'Something went wrong during authentication.'}
              </p>
              <div className="flex space-x-2 mt-4">
                <Button onClick={handleReturnToLogin} variant="outline">
                  Try Again
                </Button>
                <Button onClick={handleGoHome}>
                  Go to Archive
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
          <CardTitle className="text-2xl font-bold">Mysterria Archive</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  )
}