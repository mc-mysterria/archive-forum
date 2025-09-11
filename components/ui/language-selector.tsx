'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { locales } from '@/i18n'
import { Globe } from 'lucide-react'

export function LanguageSelector() {
  const t = useTranslations('language')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: string) => {
    // Get current pathname without locale prefix
    let pathWithoutLocale = pathname
    if (pathname.startsWith(`/${locale}`)) {
      pathWithoutLocale = pathname.substring(locale.length + 1) || '/'
    }
    
    // Navigate to new locale - always include locale prefix since localePrefix is 'always'
    router.replace(`/${newLocale}${pathWithoutLocale}`)
  }

  const getLanguageName = (locale: string) => {
    switch (locale) {
      case 'en':
        return t('english')
      case 'uk':
        return t('ukrainian')
      default:
        return locale
    }
  }

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {getLanguageName(locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}