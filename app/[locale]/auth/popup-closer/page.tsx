'use client'

import { useEffect } from 'react'

export default function PopupCloserPage() {
  useEffect(() => {
    // This page is designed to be loaded in the mysterria.net popup
    // It monitors for auth completion and closes the popup

    const checkAuthCompletion = () => {
      try {
        const authCompleted = localStorage.getItem('mysterria_auth_completed')
        if (authCompleted) {
          // Auth was completed, close this popup
          localStorage.removeItem('mysterria_auth_completed')

          // Try to close the parent window (mysterria.net popup)
          if (window.opener) {
            try {
              window.opener.close()
            } catch (e) {
              console.log('Could not close parent popup:', e)
            }
          }

          // Close this window too
          window.close()
        }
      } catch (e) {
        console.log('Error checking auth completion:', e)
      }
    }

    // Check immediately
    checkAuthCompletion()

    // Check every 500ms for auth completion
    const interval = setInterval(checkAuthCompletion, 500)

    // Clean up after 60 seconds (auth should complete well before this)
    const timeout = setTimeout(() => {
      clearInterval(interval)
      // If we're still here after 60 seconds, something went wrong
      window.close()
    }, 60000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-4">Completing Authentication...</h1>
        <p className="text-muted-foreground">This window will close automatically.</p>
      </div>
    </div>
  )
}