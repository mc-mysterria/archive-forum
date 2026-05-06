'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useItems } from '@/lib/hooks/use-items'
import { usePathways } from '@/lib/hooks/use-pathways'
import { useTypes } from '@/lib/hooks/use-types'
import { ItemCard } from '@/components/items/item-card'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { getPathwayTheme, getRarityMeta, getLocalizedPathwayName } from '@/lib/pathway-theme'

const RARITIES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHICAL']
const SEQUENCES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const CARD_ROTATIONS = [-1.2, 0.6, -0.8, 1, -0.4, 0.8, -1, 0.4, -0.6, 1.1, -0.7, 0.9]
const ITEMS_PER_PAGE = 20

function ItemsPageContent() {
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get('search') || ''
    const t = useTranslations('items')
    const locale = useLocale()

    const [search, setSearch] = useState(initialSearch)
    const [selectedPathways, setSelectedPathways] = useState<number[]>([])
    const [selectedTypes, setSelectedTypes] = useState<number[]>([])
    const [selectedRarities, setSelectedRarities] = useState<string[]>([])
    const [selectedSequences, setSelectedSequences] = useState<number[]>([])
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'rarity'>('newest')
    const [currentPage, setCurrentPage] = useState(1)

    const tUi = useTranslations('ui')
    const { data: items, isLoading } = useItems(search)
    const { data: pathways } = usePathways()
    const { data: types } = useTypes()

    useEffect(() => {
        setCurrentPage(1)
    }, [search, selectedPathways, selectedTypes, selectedRarities, selectedSequences, sortBy])

    const filteredAndSortedItems = useMemo(() => {
        if (!items) return []
        let filtered = [...items]
        if (selectedPathways.length > 0)
            filtered = filtered.filter(item => item.pathway && selectedPathways.includes(item.pathway.id))
        if (selectedTypes.length > 0)
            filtered = filtered.filter(item => item.type && selectedTypes.includes(item.type.id))
        if (selectedRarities.length > 0)
            filtered = filtered.filter(item => item.rarity && selectedRarities.includes(item.rarity))
        if (selectedSequences.length > 0)
            filtered = filtered.filter(item => item.sequenceNumber !== undefined && selectedSequences.includes(item.sequenceNumber))
        switch (sortBy) {
            case 'newest': filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
            case 'oldest': filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break
            case 'name':   filtered.sort((a, b) => a.name.localeCompare(b.name)); break
            case 'rarity': {
                const order = { MYTHICAL: 0, LEGENDARY: 1, EPIC: 2, RARE: 3, UNCOMMON: 4, COMMON: 5 }
                filtered.sort((a, b) => (order[a.rarity as keyof typeof order] ?? 6) - (order[b.rarity as keyof typeof order] ?? 6))
                break
            }
        }
        return filtered
    }, [items, selectedPathways, selectedTypes, selectedRarities, selectedSequences, sortBy])

    const totalPages = Math.max(1, Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE))
    const clampedPage = Math.min(currentPage, totalPages)
    const paginatedItems = filteredAndSortedItems.slice(
        (clampedPage - 1) * ITEMS_PER_PAGE,
        clampedPage * ITEMS_PER_PAGE
    )

    const resetFilters = () => {
        setSelectedPathways([])
        setSelectedTypes([])
        setSelectedRarities([])
        setSelectedSequences([])
        setSortBy('newest')
    }

    const hasActiveFilters = selectedPathways.length > 0 || selectedTypes.length > 0 ||
        selectedRarities.length > 0 || selectedSequences.length > 0

    const toggleSeq = (seq: number) => {
        setSelectedSequences(prev =>
            prev.includes(seq) ? prev.filter(s => s !== seq) : [...prev, seq]
        )
    }

    const togglePathway = (id: number) =>
        setSelectedPathways(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

    const toggleRarity = (r: string) =>
        setSelectedRarities(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])

    return (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
            {/* Page head */}
            <div style={{
                padding: '42px 56px 24px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'end',
                gap: 24,
            }}>
                <div>
                    <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.4em', fontSize: 12, color: 'var(--gold-soft)', display: 'block' }}>
                        — {tUi('greatCatalogue')} —
                    </div>
                    <h1 style={{
                        fontFamily: '"IM Fell English", serif',
                        fontWeight: 400,
                        color: '#f0e6cf',
                        fontSize: 54,
                        lineHeight: 1,
                        margin: '8px 0',
                    }}>
                        {t('title')}
                    </h1>
                    <div style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', color: '#a89b78' }}>
                        {filteredAndSortedItems.length > 0
                            ? tUi('cardsInDeck', { count: filteredAndSortedItems.length })
                            : tUi('loadingDeck')}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as any)}
                        style={{
                            background: 'var(--velvet-2)',
                            border: '1px solid var(--line)',
                            color: '#a89b78',
                            padding: '9px 14px',
                            fontFamily: '"IM Fell English SC", serif',
                            letterSpacing: '0.12em',
                            fontSize: 12,
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="newest">{tUi('sortNewest')}</option>
                        <option value="oldest">{tUi('sortOldest')}</option>
                        <option value="name">{tUi('sortNameAZ')}</option>
                        <option value="rarity">{tUi('sortRarityHigh')}</option>
                    </select>
                    <Link href="/items/new" className="btn-velvet primary">{tUi('drawNewCard')}</Link>
                </div>
            </div>

            {/* Two-column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 36, padding: '8px 56px 80px' }}>
                {/* Filters sidebar */}
                <aside style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
                    {/* Search */}
                    <div style={{ paddingTop: 8, marginBottom: 0 }}>
                        <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 11, color: 'var(--gold-soft)', marginBottom: 12 }}>
                            — {tUi('inquire')} —
                        </div>
                        <input
                            placeholder={t('searchPlaceholder')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'var(--velvet-2)',
                                border: '1px solid var(--line)',
                                padding: '10px 14px',
                                color: '#f0e6cf',
                                fontFamily: '"EB Garamond", serif',
                                fontSize: 15,
                                fontStyle: 'italic',
                                outline: 'none',
                            }}
                        />
                    </div>

                    {/* Pathways */}
                    {pathways && pathways.length > 0 && (
                        <div style={{ borderTop: '1px solid var(--line)', padding: '18px 0' }}>
                            <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 11, color: 'var(--gold-soft)', marginBottom: 12 }}>
                                — {tUi('suitsPathways')} —
                            </div>
                            {pathways.map(pathway => {
                                const theme = getPathwayTheme(pathway.name)
                                const checked = selectedPathways.includes(pathway.id)
                                return (
                                    <div
                                        key={pathway.id}
                                        onClick={() => togglePathway(pathway.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            padding: '6px 0',
                                            cursor: 'pointer',
                                            color: '#c5b890',
                                            fontSize: 14,
                                            transition: 'color 0.15s',
                                        }}
                                    >
                                        <div style={{
                                            width: 14,
                                            height: 14,
                                            border: '1px solid var(--gold-deep)',
                                            flexShrink: 0,
                                            background: checked ? 'var(--gold-soft)' : 'transparent',
                                            boxShadow: checked ? 'inset 0 0 0 2px var(--velvet-2)' : undefined,
                                        }} />
                                        <span style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            border: `1px solid ${theme.color}`,
                                            color: theme.color,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontFamily: '"IM Fell English", serif',
                                            fontSize: 11,
                                            flexShrink: 0,
                                        }}>
                                            {theme.sigil}
                                        </span>
                                        <span style={{ fontFamily: '"IM Fell English", serif' }}>{getLocalizedPathwayName(pathway.name, locale)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Rarity */}
                    <div style={{ borderTop: '1px solid var(--line)', padding: '18px 0' }}>
                        <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 11, color: 'var(--gold-soft)', marginBottom: 12 }}>
                            — {tUi('arcanaRarity')} —
                        </div>
                        {RARITIES.map(rarity => {
                            const meta = getRarityMeta(rarity)
                            const checked = selectedRarities.includes(rarity)
                            return (
                                <div
                                    key={rarity}
                                    onClick={() => toggleRarity(rarity)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '6px 0',
                                        cursor: 'pointer',
                                        color: '#c5b890',
                                        fontSize: 14,
                                        transition: 'color 0.15s',
                                    }}
                                >
                                    <div style={{
                                        width: 14,
                                        height: 14,
                                        border: '1px solid var(--gold-deep)',
                                        flexShrink: 0,
                                        background: checked ? 'var(--gold-soft)' : 'transparent',
                                        boxShadow: checked ? 'inset 0 0 0 2px var(--velvet-2)' : undefined,
                                    }} />
                                    <span style={{ width: 20, textAlign: 'center', color: meta.color }}>{meta.glyph}</span>
                                    <span style={{ fontFamily: '"IM Fell English", serif' }}>
                                        {rarity.charAt(0) + rarity.slice(1).toLowerCase()}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Sequence */}
                    <div style={{ borderTop: '1px solid var(--line)', padding: '18px 0' }}>
                        <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 11, color: 'var(--gold-soft)', marginBottom: 12 }}>
                            — {t('sequences')} —
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {SEQUENCES.map(seq => (
                                <button
                                    key={seq}
                                    onClick={() => toggleSeq(seq)}
                                    className={`seq-num${selectedSequences.includes(seq) ? ' active' : ''}`}
                                >
                                    {seq}
                                </button>
                            ))}
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            style={{
                                width: '100%',
                                padding: '8px 0',
                                background: 'transparent',
                                border: '1px solid rgba(217,183,106,.3)',
                                color: '#7a7058',
                                fontFamily: '"IM Fell English SC", serif',
                                letterSpacing: '0.2em',
                                fontSize: 11,
                                cursor: 'pointer',
                                marginTop: 8,
                            }}
                        >
                            — {tUi('clearFiltersLabel')} —
                        </button>
                    )}
                </aside>

                {/* Results */}
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: 18,
                        borderBottom: '1px solid var(--line)',
                        marginBottom: 22,
                    }}>
                        <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.2em', fontSize: 12, color: 'var(--gold-soft)' }}>
                            — {tUi('entriesFound', { count: filteredAndSortedItems.length })} —
                        </div>
                    </div>

                    {isLoading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} style={{ aspectRatio: '5/7', background: 'var(--velvet-2)', borderRadius: 6, opacity: 0.4 }} />
                            ))}
                        </div>
                    ) : paginatedItems.length > 0 ? (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
                                {paginatedItems.map((item, i) => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        rotation={CARD_ROTATIONS[i % CARD_ROTATIONS.length]}
                                    />
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 20,
                                    paddingTop: 36,
                                    borderTop: '1px solid var(--line)',
                                    marginTop: 28,
                                }}>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={clampedPage <= 1}
                                        className="btn-velvet"
                                        style={{ opacity: clampedPage <= 1 ? 0.4 : 1 }}
                                    >
                                        {tUi('prevPage')}
                                    </button>
                                    <span style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.18em', fontSize: 11, color: 'var(--gold-soft)' }}>
                                        {tUi('pageOf', { current: clampedPage, total: totalPages })}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={clampedPage >= totalPages}
                                        className="btn-velvet"
                                        style={{ opacity: clampedPage >= totalPages ? 0.4 : 1 }}
                                    >
                                        {tUi('nextPage')}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <div style={{ maxWidth: 200, margin: '0 auto', aspectRatio: '5/7' }}>
                                <div className="tarot-card" style={{ height: '100%', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                                    <span className="tc-corner tl" /><span className="tc-corner tr" /><span className="tc-corner bl" /><span className="tc-corner br" />
                                    <div style={{ fontSize: 48, color: 'var(--gold-deep)' }}>∅</div>
                                    <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.2em', fontSize: 11, color: 'var(--ink-2)', textAlign: 'center' }}>
                                        {tUi('noCardsAdjustFilters')}
                                    </div>
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <button onClick={resetFilters} className="btn-velvet" style={{ marginTop: 24 }}>
                                    {tUi('clearFiltersLabel')}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function ItemsPage() {
    return (
        <Suspense fallback={
            <div style={{ padding: '42px 56px' }}>
                <div style={{ height: 6, width: 160, background: 'var(--velvet-2)', borderRadius: 3, marginBottom: 24, opacity: 0.6 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} style={{ aspectRatio: '5/7', background: 'var(--velvet-2)', borderRadius: 6, opacity: 0.4 }} />
                    ))}
                </div>
            </div>
        }>
            <ItemsPageContent />
        </Suspense>
    )
}
