'use client'

import { ResearcherSelector } from '@/components/researcher/researcher-selector'
import { LanguageSelector } from '@/components/ui/language-selector'

export function HeaderClientWrapper() {
    return (
        <>
            <LanguageSelector />
            <ResearcherSelector />
        </>
    )
}