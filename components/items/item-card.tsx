'use client'

import { ItemDto } from '@/lib/types'
import { TarotCard, Filigree, SigilRing } from '@/components/ui/tarot-card'
import { getPathwayTheme, toRoman, getRarityMeta, getLocalizedPathwayName } from '@/lib/pathway-theme'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/use-auth'
import { useDeleteItem } from '@/lib/hooks/use-items'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

interface ItemCardProps {
    item: ItemDto
    rotation?: number
    mini?: boolean
}

const DEFAULT_ROTATIONS = [-1.2, 0.6, -0.8, 1, -0.4, 0.8, -1, 0.4, -0.6, 1.1, -0.7, 0.9]

export function ItemCard({ item, rotation, mini = false }: ItemCardProps) {
    const { user, canModerate } = useAuth()
    const deleteItem = useDeleteItem()
    const router = useRouter()
    const locale = useLocale()

    const theme = getPathwayTheme(item.pathway?.name)
    const rarityMeta = getRarityMeta(item.rarity)
    const seq = item.sequenceNumber
    const seqRoman = seq !== undefined ? toRoman(seq) : '—'
    const rot = rotation ?? DEFAULT_ROTATIONS[item.id % DEFAULT_ROTATIONS.length]

    const canEdit = () => user && item && (user.id.toString() === item.researcher.id.toString() || canModerate())
    const canDelete = () => user && item && (user.id.toString() === item.researcher.id.toString() || canModerate())

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this item?')) return
        try { await deleteItem.mutateAsync(item.id) }
        catch (error) { console.error('Failed to delete item:', error) }
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`/items/${item.id}/edit`)
    }

    if (mini) {
        return (
            <div className="tc-hover-wrap" style={{ cursor: 'pointer' }}>
                <Link href={`/items/${item.id}`} style={{ display: 'block', aspectRatio: '4/5', textDecoration: 'none' }}>
                    <TarotCard
                        rotation={rot}
                        style={{ height: '100%', padding: '12px 10px', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{
                            fontFamily: '"IM Fell English SC", serif',
                            letterSpacing: '0.08em',
                            fontSize: 8,
                            display: 'flex',
                            justifyContent: 'space-between',
                            color: theme.color,
                        }}>
                            <span>SEQ. {seqRoman}</span>
                            <span>{theme.abbr}</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SigilRing glyph={theme.sigil} size="lg" color={theme.color} />
                        </div>
                        <div style={{
                            fontFamily: '"IM Fell English SC", serif',
                            letterSpacing: '0.03em',
                            fontSize: 10,
                            textAlign: 'center',
                            color: 'var(--ink)',
                            lineHeight: 1.2,
                        }}>
                            {item.name}
                        </div>
                        <div style={{
                            fontFamily: '"IM Fell English SC", serif',
                            letterSpacing: '0.12em',
                            fontSize: 8,
                            textAlign: 'center',
                            marginTop: 2,
                            color: theme.color,
                        }}>
                            · {getLocalizedPathwayName(item.pathway?.name, locale)} ·
                        </div>
                    </TarotCard>
                </Link>
            </div>
        )
    }

    return (
        <div className="tc-hover-wrap relative group" style={{ cursor: 'pointer' }}>
            <Link href={`/items/${item.id}`} style={{ display: 'block', aspectRatio: '5/7', textDecoration: 'none' }}>
                <TarotCard
                    rotation={rot}
                    style={{ height: '100%', padding: '14px 12px', display: 'flex', flexDirection: 'column' }}
                >
                    {/* Sequence + pathway abbr */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontFamily: '"IM Fell English SC", serif',
                        letterSpacing: '0.1em',
                        fontSize: 9,
                        marginBottom: 4,
                        color: theme.color,
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        <span>{seq !== undefined ? `SEQ. ${seqRoman}` : '—'}</span>
                        <span>{theme.abbr}</span>
                    </div>

                    <Filigree sigil={theme.sigil} size={10} />

                    {/* Glyph */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        <SigilRing glyph={theme.sigil} size="lg" color={theme.color} />
                        <div style={{
                            fontFamily: '"IM Fell English", serif',
                            fontSize: 18,
                            color: 'var(--gold-deep)',
                            marginTop: 6,
                        }}>
                            — {seqRoman} —
                        </div>
                    </div>

                    {/* Name */}
                    <div style={{
                        fontFamily: '"IM Fell English SC", serif',
                        letterSpacing: '0.04em',
                        fontSize: 11,
                        textAlign: 'center',
                        color: 'var(--ink)',
                        lineHeight: 1.2,
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        {item.name}
                    </div>

                    {/* Pathway */}
                    <div style={{
                        textAlign: 'center',
                        fontFamily: '"IM Fell English SC", serif',
                        letterSpacing: '0.14em',
                        fontSize: 9,
                        marginTop: 3,
                        color: theme.color,
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        · {getLocalizedPathwayName(item.pathway?.name, locale)} ·
                    </div>

                    {/* Footer */}
                    <div style={{
                        marginTop: 8,
                        paddingTop: 6,
                        borderTop: '1px solid var(--gold-deep)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 9,
                        color: 'var(--ink-2)',
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        <span style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <span style={{ color: rarityMeta.color }}>{rarityMeta.glyph}</span>
                            {item.rarity ? item.rarity.charAt(0) + item.rarity.slice(1).toLowerCase() : '—'}
                        </span>
                        <span style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic' }}>
                            {item.type?.name ?? '—'}
                        </span>
                    </div>
                </TarotCard>
            </Link>

            {(canEdit() || canDelete()) && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1" style={{ zIndex: 10 }}>
                    {canEdit() && (
                        <button onClick={handleEdit} disabled={deleteItem.isPending} style={{
                            padding: '3px 7px', background: 'var(--velvet-2)',
                            border: '1px solid var(--line)', color: 'var(--gold-soft)',
                            cursor: 'pointer', fontSize: 10,
                            fontFamily: '"IM Fell English SC", serif',
                        }}>edit</button>
                    )}
                    {canDelete() && (
                        <button onClick={handleDelete} disabled={deleteItem.isPending} style={{
                            padding: '3px 7px', background: 'var(--velvet-2)',
                            border: '1px solid rgba(193,74,58,.5)', color: '#c14a3a',
                            cursor: 'pointer', fontSize: 10,
                            fontFamily: '"IM Fell English SC", serif',
                        }}>✕</button>
                    )}
                </div>
            )}
        </div>
    )
}
