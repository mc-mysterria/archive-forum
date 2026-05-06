'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { locales } from '@/i18n'
import { useState, useRef, useEffect } from 'react'

const LANG_LABELS: Record<string, { label: string; flag: string }> = {
    en: { label: 'EN', flag: '🇬🇧' },
    uk: { label: 'УК', flag: '🇺🇦' },
}

export function LanguageSelector() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const handleSelect = (newLocale: string) => {
        setOpen(false)
        let pathWithoutLocale = pathname
        if (pathname.startsWith(`/${locale}`)) {
            pathWithoutLocale = pathname.substring(locale.length + 1) || '/'
        }
        router.replace(`/${newLocale}${pathWithoutLocale}`)
    }

    const current = LANG_LABELS[locale] ?? { label: locale.toUpperCase(), flag: '🌐' }

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 12px',
                    background: open ? 'var(--velvet-3)' : 'var(--velvet-2)',
                    border: '1px solid var(--line)',
                    color: '#a89b78',
                    fontFamily: '"IM Fell English SC", serif',
                    letterSpacing: '0.14em',
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'background 0.15s, color 0.15s',
                    outline: 'none',
                    whiteSpace: 'nowrap',
                }}
            >
                <span style={{ fontSize: 14 }}>{current.flag}</span>
                {current.label}
                <span style={{ fontSize: 8, marginLeft: 2, opacity: 0.6 }}>▾</span>
            </button>

            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    right: 0,
                    minWidth: '100%',
                    background: 'var(--velvet-2)',
                    border: '1px solid var(--line)',
                    boxShadow: '0 8px 24px rgba(0,0,0,.5)',
                    zIndex: 200,
                }}>
                    {locales.map(loc => {
                        const meta = LANG_LABELS[loc] ?? { label: loc.toUpperCase(), flag: '🌐' }
                        const active = loc === locale
                        return (
                            <button
                                key={loc}
                                onClick={() => handleSelect(loc)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    width: '100%',
                                    padding: '9px 14px',
                                    background: active ? 'var(--velvet-3)' : 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid var(--line)',
                                    color: active ? '#f0e6cf' : '#a89b78',
                                    fontFamily: '"IM Fell English SC", serif',
                                    letterSpacing: '0.14em',
                                    fontSize: 12,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'background 0.12s, color 0.12s',
                                }}
                                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--velvet-3)' }}
                                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                            >
                                <span style={{ fontSize: 14 }}>{meta.flag}</span>
                                {meta.label}
                                {active && <span style={{ marginLeft: 'auto', color: 'var(--gold-soft)', fontSize: 10 }}>✓</span>}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
