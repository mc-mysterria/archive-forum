'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogIn, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = () => {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://www.mysterria.net'
    const archiveUrl = process.env.NEXT_PUBLIC_ARCHIVE_URL || 'https://archive.mysterria.net'
    const returnUrl = searchParams.get('returnUrl') || '/'

    // Open auth in popup window
    const loginUrl = `${authUrl}/login?redirect=${encodeURIComponent(
      `${archiveUrl}/auth/callback?popup=true&returnUrl=${encodeURIComponent(returnUrl)}`
    )}`

    const popup = window.open(
      loginUrl,
      'mysterria-auth',
      'width=500,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
    )

    if (!popup) {
      alert('Please allow popups for this site to login')
      return
    }

    // Listen for authentication success
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== (process.env.NEXT_PUBLIC_ARCHIVE_URL || 'https://archive.mysterria.net')) {
        return
      }

      if (event.data.type === 'MYSTERRIA_AUTH_SUCCESS') {
        // Close popup
        popup.close()

        // Redirect parent window to return URL
        router.replace(event.data.returnUrl || '/')

        // Clean up listener
        window.removeEventListener('message', handleMessage)
      } else if (event.data.type === 'MYSTERRIA_AUTH_ERROR') {
        // Close popup and show error
        popup.close()
        alert(event.data.error || 'Authentication failed')
        window.removeEventListener('message', handleMessage)
      }
    }

    window.addEventListener('message', handleMessage)

    // Clean up if popup is closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        window.removeEventListener('message', handleMessage)
      }
    }, 1000)
  }

  // If user is already authenticated, redirect back
  useEffect(() => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
    if (token) {
      const returnUrl = searchParams.get('returnUrl') || '/'
      router.replace(returnUrl)
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Mysterria Archive</CardTitle>
          <p className="text-muted-foreground mt-2">
            Sign in with your Mysterria account to contribute to the archive
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-sm text-muted-foreground mb-6">
              You&apos;ll be redirected to the main Mysterria site to sign in securely.
            </p>
          </div>

          <Button onClick={handleLogin} className="w-full" size="lg">
            Continue to Mysterria Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?{' '}
              <a
                href={`${process.env.NEXT_PUBLIC_AUTH_URL || 'https://www.mysterria.net'}/register`}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Create one on Mysterria
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}