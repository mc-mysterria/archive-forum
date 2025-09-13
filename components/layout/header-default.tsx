'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Compass, Package, Users, Plus, Globe, LogIn, LogOut, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'

export function HeaderDefault() {
    const pathname = usePathname()
    const router = useRouter()
    const { isAuthenticated, user, canWrite, logout } = useAuth()
    const t = useTranslations()
    const tAuth = useTranslations('auth')
    const tNav = useTranslations('nav')
    const tLanguage = useTranslations('language')

    const navigation = [
        { name: tNav('items'), href: '/items', icon: BookOpen },
        { name: tNav('pathways'), href: '/pathways', icon: Compass },
        { name: tNav('types'), href: '/types', icon: Package },
        { name: tNav('researchers'), href: '/researchers', icon: Users },
    ]

    const handleLanguageChange = (newLocale: string) => {
        if (newLocale === 'uk') {
            router.push(`/uk${pathname}`)
        }
        // For 'en', we stay on the current route since it's the default
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

        // Listen for authentication success
        const handleMessage = (event: MessageEvent) => {
            // Verify origin for security
            if (event.origin !== (process.env.NEXT_PUBLIC_ARCHIVE_URL || 'https://archive.mysterria.net')) {
                return
            }

            if (event.data.type === 'MYSTERRIA_AUTH_SUCCESS') {
                // Close the main mysterria.net popup (it might still be open)
                popup.close()

                // Also try to close any other auth-related popups
                try {
                    // Find and close any mysterria.net login windows
                    const allWindows = [popup]
                    allWindows.forEach(win => {
                        if (win && !win.closed) {
                            win.close()
                        }
                    })
                } catch (e) {
                    console.log('Could not close additional popups:', e)
                }

                // Reload to update auth state
                window.location.reload()
                window.removeEventListener('message', handleMessage)
            } else if (event.data.type === 'MYSTERRIA_AUTH_ERROR') {
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

        // Also monitor for successful auth without popup closing (nested OAuth scenario)
        const checkAuthSuccess = setInterval(() => {
            const token = localStorage.getItem('access_token')
            if (token && !popup.closed) {
                // Authentication succeeded but popup is still open
                // This happens with nested OAuth - close the popup manually
                popup.close()
                clearInterval(checkAuthSuccess)
                window.location.reload()
                window.removeEventListener('message', handleMessage)
            }
        }, 1000)

        // Clean up the auth success checker after 2 minutes
        setTimeout(() => {
            clearInterval(checkAuthSuccess)
        }, 120000)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">{tNav('mysterria')}</span>
                        </Link>

                        <nav className="hidden md:flex gap-6">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                                            pathname === item.href
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <Select value="en" onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-[140px]">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">{tLanguage('english')}</SelectItem>
                                <SelectItem value="uk">{tLanguage('ukrainian')}</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Add Item button - only show if user can write */}
                        {isAuthenticated && canWrite() ? (
                            <Link href="/items/new">
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {tNav('addItem')}
                                </Button>
                            </Link>
                        ) : !isAuthenticated ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogin}
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                {tAuth('loginToContribute')}
                            </Button>
                        ) : null}

                        {/* User menu - only show if authenticated */}
                        {isAuthenticated && user && (
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <User className="h-4 w-4 mr-2" />
                                        {user.username}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80">
                                    <SheetHeader>
                                        <SheetTitle>{tAuth('userMenu')}</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-4">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <User className="h-4 w-4 mr-2" />
                                            {tAuth('profile')}
                                        </Button>
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
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}