'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from '@/components/ui/language-selector'
import { LogIn, LogOut, User, Plus, Shield, Settings, Package, Compass, Activity } from 'lucide-react'
import Link from 'next/link'
import { useResearcherStore } from '@/lib/store/researcher-store'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function HeaderClientWrapper() {
    const { isAuthenticated, user, logout, setAuth, canWrite, canModerate } = useAuth()
    const { researcher } = useResearcherStore()
    const router = useRouter()
    const pathname = usePathname()
    const tAuth = useTranslations('auth')

    const getUserRole = () => {
        if (!user) return null
        if (canModerate()) return { label: 'Admin', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
        if (canWrite()) return { label: 'Contributor', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' }
        return { label: 'Reader', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' }
    }

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
            alert(tAuth('popupBlockedMessage'))
            return
        }

        // Listen for authentication success from www.mysterria.net
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== (process.env.NEXT_PUBLIC_AUTH_URL || 'https://www.mysterria.net')) {
                return
            }

            if (event.data?.type === 'AUTH_SUCCESS') {
                popup.close()

                const token = event.data.token
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]))
                        const user = {
                            id: payload.sub,
                            username: payload.username || `User-${payload.sub.slice(0, 8)}`,
                            email: payload.email || undefined,
                            permissions: payload.permissions || [],
                        }
                        setAuth(token, user)
                        localStorage.setItem('access_token', token)
                    } catch (e) {
                        console.error('Token decode error:', e)
                    }
                }

                window.removeEventListener('message', handleMessage)
                window.location.reload()
            } else if (event.data?.type === 'AUTH_ERROR') {
                popup.close()
                alert(event.data.error || tAuth('authFailed'))
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
                        <button className="btn-velvet ghost">
                            <User className="h-4 w-4" />
                            <span>{user.username}</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                        <SheetHeader>
                            <SheetTitle>{tAuth('userMenu')}</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">{user.username}</span>
                                </div>
                                {getUserRole() && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserRole()?.color}`}>
                                        {getUserRole()?.label}
                                    </span>
                                )}
                            </div>
                            <Link href={researcher ? `/researchers/${researcher.id}` : '/researchers'}>
                                <Button variant="ghost" className="w-full justify-start">
                                    <User className="h-4 w-4 mr-2" />
                                    {tAuth('profile')}
                                </Button>
                            </Link>

                            {canModerate() && (
                                <>
                                    <div className="px-3 py-2">
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <Shield className="h-4 w-4" />
                                            Moderation
                                        </div>
                                    </div>
                                    <Link href="/moderation/actions">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Activity className="h-4 w-4 mr-2" />
                                            Action Logs
                                        </Button>
                                    </Link>
                                    <Link href="/pathways">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Compass className="h-4 w-4 mr-2" />
                                            Manage Pathways
                                        </Button>
                                    </Link>
                                    <Link href="/types">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Package className="h-4 w-4 mr-2" />
                                            Manage Types
                                        </Button>
                                    </Link>
                                </>
                            )}

                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                {tAuth('logout')}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            ) : (
                // Login button for unauthenticated users
                <button
                    className="btn-velvet ghost"
                    onClick={handleLogin}
                >
                    <LogIn className="h-4 w-4" />
                    <span>{tAuth('login')}</span>
                </button>
            )}
        </>
    )
}