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
                    onClick={() => router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`)}
                >
                    <LogIn className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Login</span>
                </Button>
            )}
        </>
    )
}