'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from '@/components/ui/language-selector'
import { LogIn, LogOut, User, Plus } from 'lucide-react'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function HeaderClientWrapper() {
    const { isAuthenticated, user, logout, canWrite } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    const handleLogin = () => {
        const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://www.mysterria.net'
        const archiveUrl = process.env.NEXT_PUBLIC_ARCHIVE_URL || 'https://archive.mysterria.net'

        // Open auth in popup window
        const loginUrl = `${authUrl}/login?redirect=${encodeURIComponent(
            `${archiveUrl}/auth/callback?popup=true&returnUrl=${encodeURIComponent(pathname)}`
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
                // Close popup and reload to update auth state
                popup.close()
                window.location.reload()
                window.removeEventListener('message', handleMessage)
            } else if (event.data.type === 'MYSTERRIA_AUTH_ERROR') {
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

    return (
        <>
            <LanguageSelector />

            {/* Authentication Section */}
            {isAuthenticated && user ? (
                // Authenticated user menu
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <User className="h-4 w-4 mr-2" />
                            <span className="hidden md:inline">{user.username}</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                        <SheetHeader>
                            <SheetTitle>User Menu</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                            <Button variant="ghost" className="w-full justify-start">
                                <User className="h-4 w-4 mr-2" />
                                Profile
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            ) : (
                // Login button for unauthenticated users
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogin}
                >
                    <LogIn className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Login</span>
                </Button>
            )}
        </>
    )
}