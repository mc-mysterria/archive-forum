'use client'

import { useItems } from '@/lib/hooks/use-items'
import { useResearchers } from '@/lib/hooks/use-researchers'
import { usePathways } from '@/lib/hooks/use-pathways'
import { TarotCard, Filigree, SigilRing } from '@/components/ui/tarot-card'
import { ItemCard } from '@/components/items/item-card'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

const ROT = [-3, 0.5, 3]
const MINI_ROT = [-2, 1, -1, 2, -2, 1]

export default function HomePage() {
    const { data: items, isLoading: itemsLoading } = useItems()
    const { data: researchers } = useResearchers()
    const { data: pathways } = usePathways()
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()
    const params = useParams()
    const locale = params.locale as string
    const tHome = useTranslations('home')
    const tUi = useTranslations('ui')

    const recentItems = items?.slice(0, 6) ?? []
    const totalItems = items?.length ?? 0
    const totalResearchers = researchers?.length ?? 0
    const totalPathways = pathways?.length ?? 0

    const getLocalizedHref = (href: string) =>
        locale && locale !== 'en' ? `/${locale}${href}` : href

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(getLocalizedHref(`/items?search=${encodeURIComponent(searchQuery)}`))
        }
    }

    const destCards = [
        {
            roman: 'I',
            filigree: '◆',
            sigil: '✶',
            sigilColor: 'var(--p-sun)',
            name: tHome('itemsCardName'),
            meta: totalItems > 0 ? tHome('itemsCardMeta', { count: totalItems }) : tHome('itemsCardMetaDefault'),
            flavor: tHome('itemsCardFlavor'),
            cta: tHome('itemsCardCta'),
            href: getLocalizedHref('/items'),
        },
        {
            roman: 'II',
            filigree: '☉',
            sigil: '☽',
            sigilColor: 'var(--p-demoness)',
            name: tHome('pathwaysCardName'),
            meta: totalPathways > 0 ? tHome('pathwaysCardMeta', { count: totalPathways }) : tHome('pathwaysCardMetaDefault'),
            flavor: tHome('pathwaysCardFlavor'),
            cta: tHome('pathwaysCardCta'),
            href: getLocalizedHref('/pathways'),
        },
        {
            roman: 'III',
            filigree: '⚸',
            sigil: '◐',
            sigilColor: 'var(--p-tyrant)',
            name: tHome('researchersCardName'),
            meta: totalResearchers > 0 ? tHome('researchersCardMeta', { count: totalResearchers }) : tHome('researchersCardMetaDefault'),
            flavor: tHome('researchersCardFlavor'),
            cta: tHome('researchersCardCta'),
            href: getLocalizedHref('/researchers'),
        },
    ]

    return (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '48px 56px 32px' }}>
                <div className="orn-rule" style={{ fontSize: 18, marginBottom: 12 }}>
                    <span style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.4em', fontSize: 12, color: 'var(--gold-soft)' }}>
                        — {tHome('registrySubtitle')} —
                    </span>
                </div>
                <h1 style={{
                    fontFamily: '"IM Fell English", serif',
                    fontWeight: 400,
                    color: '#f0e6cf',
                    fontSize: 60,
                    lineHeight: 1,
                    margin: '8px 0',
                    textShadow: '0 0 40px rgba(217,183,106,.12)',
                }}>
                    {tHome('title')}
                </h1>
                <p style={{
                    fontStyle: 'italic',
                    color: '#a89b78',
                    fontSize: 18,
                    maxWidth: 600,
                    margin: '6px auto 0',
                    fontFamily: '"EB Garamond", serif',
                }}>
                    {totalItems > 0
                        ? tHome('artefactsCatalogued', { items: totalItems, researchers: totalResearchers, pathways: totalPathways })
                        : tHome('emptyArchiveDesc')}
                </p>
            </div>

            {/* Three-up destination cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 28,
                padding: '12px 56px 60px',
                perspective: 1400,
            }}>
                {destCards.map((card, i) => (
                    <div key={card.roman} className="tc-hover-wrap">
                    <Link
                        href={card.href}
                        style={{ display: 'block', aspectRatio: '5/8', textDecoration: 'none' }}
                    >
                        <TarotCard
                            rotation={ROT[i]}
                            style={{
                                height: '100%',
                                padding: '28px 22px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{
                                fontFamily: '"IM Fell English", serif',
                                fontSize: 22,
                                color: 'var(--gold-deep)',
                                letterSpacing: '0.2em',
                                marginTop: 8,
                            }}>
                                — {card.roman} —
                            </div>
                            <div style={{
                                color: 'var(--gold-deep)',
                                fontFamily: '"IM Fell English", serif',
                                fontSize: 18,
                                letterSpacing: '0.5em',
                                marginTop: 8,
                                textAlign: 'center',
                            }}>
                                ✦ {card.filigree} ✦
                            </div>
                            <div style={{ margin: '18px 0 14px', color: 'var(--ink)' }}>
                                <SigilRing glyph={card.sigil} size="xxl" color={card.sigilColor} />
                            </div>
                            <div style={{
                                fontFamily: '"IM Fell English", serif',
                                fontSize: 36,
                                lineHeight: 1,
                                color: 'var(--ink)',
                                textAlign: 'center',
                                marginBottom: 6,
                            }}>
                                {card.name}
                            </div>
                            <div style={{
                                fontFamily: '"IM Fell English SC", serif',
                                letterSpacing: '0.18em',
                                fontSize: 11,
                                color: 'var(--ink-2)',
                                textAlign: 'center',
                            }}>
                                {card.meta}
                            </div>
                            <div style={{
                                marginTop: 'auto',
                                paddingTop: 18,
                                fontFamily: '"EB Garamond", serif',
                                fontStyle: 'italic',
                                fontSize: 14,
                                color: 'var(--ink-2)',
                                textAlign: 'center',
                                borderTop: '1px solid var(--gold-deep)',
                                width: '70%',
                            }}>
                                {card.flavor}
                            </div>
                            <div style={{
                                marginTop: 14,
                                fontFamily: '"IM Fell English SC", serif',
                                letterSpacing: '0.2em',
                                fontSize: 11,
                                color: 'var(--gold-deep)',
                            }}>
                                {card.cta}
                            </div>
                        </TarotCard>
                    </Link>
                    </div>
                ))}
            </div>

            {/* Search row */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0 56px 36px' }}>
                <form
                    onSubmit={handleSearch}
                    style={{
                        width: 'min(720px, 90%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 18px',
                        background: 'var(--velvet-2)',
                        border: '1px solid var(--line)',
                        boxShadow: '0 0 0 1px rgba(0,0,0,.4) inset, 0 10px 30px rgba(0,0,0,.4)',
                    }}
                >
                    <span style={{ color: 'var(--gold-soft)', fontSize: 18 }}>⌕</span>
                    <input
                        type="text"
                        placeholder={tHome('consultDeck')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: '#e9dfc3',
                            fontFamily: '"EB Garamond", serif',
                            fontSize: 18,
                            fontStyle: 'italic',
                        }}
                    />
                    <button type="submit" className="btn-velvet primary">{tHome('draw')}</button>
                </form>
            </div>

            {/* Recent strip */}
            <div style={{ padding: '10px 56px 60px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
                    <div>
                        <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.4em', fontSize: 12, color: 'var(--gold-soft)' }}>
                            — {tHome('recentDrawings')} —
                        </div>
                        <h2 style={{
                            fontFamily: '"IM Fell English", serif',
                            fontSize: 36,
                            color: '#f0e6cf',
                            margin: '6px 0 0',
                            fontWeight: 400,
                        }}>
                            {tHome('newlyTurnedCards')}
                        </h2>
                    </div>
                    <Link
                        href={getLocalizedHref('/items')}
                        style={{ fontStyle: 'italic', color: '#a89b78', textDecoration: 'none', fontFamily: '"EB Garamond", serif' }}
                    >
                        {tHome('viewFullDeck')}
                    </Link>
                </div>

                {itemsLoading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} style={{ aspectRatio: '4/5', background: 'var(--velvet-2)', borderRadius: 6, opacity: 0.4 }} />
                        ))}
                    </div>
                ) : recentItems.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18 }}>
                        {recentItems.map((item, i) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                rotation={MINI_ROT[i % 6]}
                                mini
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px 0',
                        color: '#7a7058',
                        fontFamily: '"EB Garamond", serif',
                        fontStyle: 'italic',
                        fontSize: 18,
                    }}>
                        {tHome('noCardsYetPrefix')} <Link href={getLocalizedHref('/items/new')} style={{ color: 'var(--gold-soft)' }}>{tHome('inscribeFirst')}</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
