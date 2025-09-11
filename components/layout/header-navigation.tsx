'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookOpen, Compass, Package, Users } from 'lucide-react'

const iconMap = {
  BookOpen,
  Compass,
  Package,
  Users,
}

interface NavigationItem {
  name: string
  href: string
  icon: keyof typeof iconMap
}

interface HeaderNavigationProps {
  navigation: NavigationItem[]
}

export function HeaderNavigation({ navigation }: HeaderNavigationProps) {
    const pathname = usePathname()

    return (
        <nav className="hidden md:flex gap-6">
            {navigation.map((item) => {
                const Icon = iconMap[item.icon]
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
    )
}