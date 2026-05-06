import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { HeaderClientWrapper } from './header-client-wrapper'

interface HeaderServerProps {
    locale: string
}

export async function HeaderServer({ locale }: HeaderServerProps) {
    const t = await getTranslations('nav')

    const getLocalizedHref = (href: string) => {
        return locale && locale !== 'en' ? `/${locale}${href}` : href
    }

    const navLinks = [
        { label: t('items'),      href: getLocalizedHref('/items') },
        { label: t('pathways'),   href: getLocalizedHref('/pathways') },
        { label: t('researchers'),href: getLocalizedHref('/researchers') },
    ]

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '22px 56px',
            borderBottom: '1px solid var(--line)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'var(--velvet)',
            backdropFilter: 'blur(4px)',
        }}>
            {/* Brand */}
            <Link href={getLocalizedHref('/')} style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
                <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    border: '1.5px solid var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle at 30% 30%, rgba(217,183,106,.25), transparent 60%), var(--velvet-2)',
                    color: 'var(--gold-soft)',
                    fontFamily: '"IM Fell English", serif',
                    fontSize: 22,
                    boxShadow: '0 0 0 1px var(--velvet) inset, 0 0 14px rgba(217,183,106,.18)',
                    flexShrink: 0,
                }}>
                    ✦
                </div>
                <span style={{
                    fontFamily: '"IM Fell English SC", serif',
                    letterSpacing: '0.22em',
                    fontSize: 18,
                    color: 'var(--gold-soft)',
                }}>
                    MYSTERRIA
                </span>
            </Link>

            {/* Nav */}
            <nav style={{ display: 'flex', gap: 26 }}>
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        style={{
                            color: '#a89b78',
                            fontFamily: '"IM Fell English SC", serif',
                            letterSpacing: '0.14em',
                            fontSize: 13,
                            textDecoration: 'none',
                            paddingBottom: 4,
                            borderBottom: '1px solid transparent',
                            transition: 'color 0.2s, border-color 0.2s',
                        }}
                        className="topbar-nav-link"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <HeaderClientWrapper />
                <Link
                    href={getLocalizedHref('/items/new')}
                    className="btn-velvet primary"
                    style={{ fontFamily: '"IM Fell English SC", serif' }}
                >
                    + {t('addItem')}
                </Link>
            </div>
        </header>
    )
}
