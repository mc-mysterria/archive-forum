import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ResearcherSelector } from '@/components/researcher/researcher-selector'
import { LanguageSelector } from '@/components/ui/language-selector'
import { BookOpen, Compass, Package, Users, Plus } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { HeaderNavigation } from './header-navigation'

interface HeaderServerProps {
  locale: string
}

export async function HeaderServer({ locale }: HeaderServerProps) {
    const t = await getTranslations('nav')

    const getLocalizedHref = (href: string) => {
        return locale && locale !== 'en' ? `/${locale}${href}` : href
    }

    const navigation = [
        { name: t('items'), href: getLocalizedHref('/items'), icon: 'BookOpen' as const },
        { name: t('pathways'), href: getLocalizedHref('/pathways'), icon: 'Compass' as const },
        { name: t('types'), href: getLocalizedHref('/types'), icon: 'Package' as const },
        { name: t('researchers'), href: getLocalizedHref('/researchers'), icon: 'Users' as const },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href={getLocalizedHref('/')} className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">{t('mysterria')}</span>
                        </Link>

                        <HeaderNavigation navigation={navigation} />
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSelector />
                        <ResearcherSelector />
                        <Link href={getLocalizedHref('/items/new')}>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                {t('addItem')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}