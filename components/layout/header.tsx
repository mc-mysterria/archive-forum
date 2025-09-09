'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ResearcherSelector } from '@/components/researcher/researcher-selector'
import { BookOpen, Compass, Package, Users, Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Header() {
    const pathname = usePathname()

    const navigation = [
        { name: 'Items', href: '/items', icon: BookOpen },
        { name: 'Pathways', href: '/pathways', icon: Compass },
        { name: 'Types', href: '/types', icon: Package },
        { name: 'Researchers', href: '/researchers', icon: Users },
    ]

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
                        <ResearcherSelector />
                        <Link href="/items/new">
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}