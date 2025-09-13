'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ResearcherSelector } from '@/components/researcher/researcher-selector'
import { BookOpen, Compass, Package, Users, Plus, Globe, LogIn, LogOut, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
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

    const navigation = [
        { name: 'Items', href: '/items', icon: BookOpen },
        { name: 'Pathways', href: '/pathways', icon: Compass },
        { name: 'Types', href: '/types', icon: Package },
        { name: 'Researchers', href: '/researchers', icon: Users },
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

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">Mysterria</span>
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
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="uk">Українська</SelectItem>
                            </SelectContent>
                        </Select>

                        <ResearcherSelector />

                        {/* Add Item button - only show if user can write */}
                        {isAuthenticated && canWrite() ? (
                            <Link href="/items/new">
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Item
                                </Button>
                            </Link>
                        ) : !isAuthenticated ? (
                            <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
                                <LogIn className="h-4 w-4 mr-2" />
                                Login to Contribute
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
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}