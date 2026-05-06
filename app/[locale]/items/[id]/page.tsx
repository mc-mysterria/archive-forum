'use client'

import { useParams, useRouter } from 'next/navigation'
import { useItem, useDeleteItem, useItemsByPathway } from '@/lib/hooks/use-items'
import { useCommentsByItem } from '@/lib/hooks/use-comments'
import { CommentForm } from '@/components/comments/comment-form'
import { CommentList } from '@/components/comments/comment-list'
import { useAuth } from '@/lib/hooks/use-auth'
import { TarotCard, Filigree, SigilRing } from '@/components/ui/tarot-card'
import { getPathwayTheme, toRoman, getRarityMeta } from '@/lib/pathway-theme'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ItemCard } from '@/components/items/item-card'
import { useTranslations, useLocale } from 'next-intl'
import { getLocalizedPathwayName } from '@/lib/pathway-theme'

export default function ItemDetailPage() {
    const params = useParams()
    const router = useRouter()
    const itemId = parseInt(params.id as string)
    const tUi = useTranslations('ui')
    const tItems = useTranslations('items')
    const tNav = useTranslations('nav')
    const locale = useLocale()

    const { data: item, isLoading } = useItem(itemId)
    const { data: comments } = useCommentsByItem(itemId)
    const deleteItem = useDeleteItem()
    const { user, canModerate } = useAuth()

    const theme = getPathwayTheme(item?.pathway?.name)
    const rarityMeta = getRarityMeta(item?.rarity)
    const seq = item?.sequenceNumber
    const seqRoman = seq !== undefined ? toRoman(seq) : '—'

    const { data: relatedItems } = useItemsByPathway(item?.pathway?.id ?? 0)
    const related = relatedItems?.filter(r => r.id !== itemId).slice(0, 4) ?? []

    const canEdit = () => user && item && (user.id.toString() === item.researcher.id.toString() || canModerate())
    const canDelete = () => user && item && (user.id.toString() === item.researcher.id.toString() || canModerate())

    const handleDelete = async () => {
        if (!confirm(tItems('confirmDelete'))) return
        try {
            await deleteItem.mutateAsync(itemId)
            router.push('/items')
        } catch (error) {
            console.error('Failed to delete item:', error)
        }
    }

    if (isLoading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 56, padding: '24px 56px 80px', position: 'relative', zIndex: 1 }}>
                <div style={{ aspectRatio: '5/8', background: 'var(--velvet-2)', borderRadius: 6, opacity: 0.5 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} style={{ height: 80, background: 'var(--velvet-2)', borderRadius: 4, opacity: 0.4 }} />
                    ))}
                </div>
            </div>
        )
    }

    if (!item) {
        return (
            <div style={{ padding: '80px 56px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.2em', color: '#7a7058' }}>
                    {tUi('cardNotFound')}
                </div>
                <Link href="/items" className="btn-velvet" style={{ display: 'inline-flex', marginTop: 20 }}>
                    {tUi('returnToCatalogue')}
                </Link>
            </div>
        )
    }

    return (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ padding: '22px 56px 0' }}>
                <div style={{ color: '#7a7058', fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.16em', fontSize: 12 }}>
                    <Link href="/items" style={{ color: '#a89b78', textDecoration: 'none' }}>{tNav('items')}</Link>
                    {item.pathway && (
                        <> · <Link href={`/items?pathway=${item.pathway.id}`} style={{ color: '#a89b78', textDecoration: 'none' }}>{getLocalizedPathwayName(item.pathway.name, locale)}</Link></>
                    )}
                    {' '}· <span style={{ color: '#e9dfc3' }}>{item.name}</span>
                </div>
            </div>

            {/* Detail grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 56, padding: '24px 56px 80px' }}>
                {/* Sticky tarot card */}
                <div className="tc-hover-wrap" style={{ aspectRatio: '5/8', position: 'sticky', top: 24, alignSelf: 'start' }}>
                    <TarotCard
                        rotation={-1}
                        style={{
                            height: '100%',
                            padding: '30px 26px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* Sequence + pathway abbr */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ fontFamily: '"IM Fell English SC", serif', fontSize: 13, color: 'var(--gold-deep)', letterSpacing: '0.08em' }}>
                                — {seqRoman} —
                            </div>
                            <div style={{ fontFamily: '"IM Fell English SC", serif', fontSize: 13, color: 'var(--gold-deep)', letterSpacing: '0.08em' }}>
                                — {theme.abbr} —
                            </div>
                        </div>

                        <Filigree sigil={theme.sigil} size={14} />

                        {/* Main sigil */}
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <SigilRing glyph={theme.sigil} size="xxl" color={theme.color} />
                        </div>

                        <Filigree sigil={theme.sigil} size={14} />

                        {/* Name */}
                        <div style={{
                            fontFamily: '"IM Fell English", serif',
                            fontSize: 30,
                            color: 'var(--ink)',
                            textAlign: 'center',
                            lineHeight: 1,
                            marginBottom: 6,
                            marginTop: 8,
                        }}>
                            {item.name}
                        </div>
                        <div style={{
                            fontFamily: '"IM Fell English SC", serif',
                            letterSpacing: '0.18em',
                            fontSize: 11,
                            color: theme.color,
                            marginTop: 4,
                            textAlign: 'center',
                        }}>
                            · {getLocalizedPathwayName(item.pathway?.name, locale)} · SEQ. {seqRoman} ·
                        </div>

                        {/* Meta grid */}
                        <div style={{
                            width: '100%',
                            marginTop: 18,
                            paddingTop: 14,
                            borderTop: '1px solid var(--gold-deep)',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px 14px',
                            fontFamily: '"IM Fell English SC", serif',
                            letterSpacing: '0.1em',
                            fontSize: 10,
                            color: 'var(--ink-2)',
                        }}>
                            <div>
                                <span style={{ fontSize: 9 }}>{tItems('pathway').toUpperCase()}</span>
                                <div style={{ color: 'var(--ink)', fontSize: 13, letterSpacing: '0.04em', fontWeight: 500 }}>
                                    {getLocalizedPathwayName(item.pathway?.name, locale)}
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: 9 }}>{tItems('sequences').toUpperCase()}</span>
                                <div style={{ color: 'var(--ink)', fontSize: 13, letterSpacing: '0.04em', fontWeight: 500 }}>
                                    {seqRoman}
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: 9 }}>{tItems('type').toUpperCase()}</span>
                                <div style={{ color: 'var(--ink)', fontSize: 13, letterSpacing: '0.04em', fontWeight: 500 }}>
                                    {item.type?.name ?? '—'}
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: 9 }}>{tItems('rarity').toUpperCase()}</span>
                                <div style={{ color: rarityMeta.color, fontSize: 13, letterSpacing: '0.04em', fontWeight: 500 }}>
                                    {item.rarity ? item.rarity.charAt(0) + item.rarity.slice(1).toLowerCase() : '—'}
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: 9 }}>{tUi('inscribedBy')}</span>
                                <div style={{ color: 'var(--ink)', fontSize: 13, letterSpacing: '0.04em', fontWeight: 500 }}>
                                    {item.researcher.nickname}
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: 9 }}>{tUi('dated')}</span>
                                <div style={{ color: 'var(--ink)', fontSize: 13, letterSpacing: '0.04em', fontWeight: 500 }}>
                                    {formatDate(item.createdAt).split(',')[0]}
                                </div>
                            </div>
                        </div>
                    </TarotCard>
                </div>

                {/* Scrollable body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                    {/* Edit/Delete actions */}
                    {(canEdit() || canDelete()) && (
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            {canEdit() && (
                                <Link href={`/items/${item.id}/edit`} className="btn-velvet">
                                    {tUi('editCard')}
                                </Link>
                            )}
                            {canDelete() && (
                                <button
                                    onClick={handleDelete}
                                    className="btn-velvet"
                                    style={{ borderColor: 'rgba(193,74,58,.5)', color: '#c14a3a' }}
                                >
                                    {tUi('destroyCard')}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Lore / description */}
                    {item.description && (
                        <div style={{ paddingTop: 0 }}>
                            <div className="field-label">— {tUi('ofItsNature')} —</div>
                            <p className="lore-text">{item.description}</p>
                        </div>
                    )}

                    {/* Purpose */}
                    {item.purpose && (
                        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 22 }}>
                            <div className="field-label">— {tUi('properties')} —</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                                <div style={{
                                    padding: '14px 16px',
                                    border: '1px solid var(--line)',
                                    background: 'linear-gradient(180deg, rgba(217,183,106,.04), transparent)',
                                }}>
                                    <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.2em', fontSize: 10, color: 'var(--gold-soft)', marginBottom: 4 }}>{tUi('drawnBy')}</div>
                                    <div style={{ fontFamily: '"IM Fell English", serif', fontSize: 22, color: '#f0e6cf' }}>{item.researcher.nickname}</div>
                                </div>
                                <div style={{
                                    padding: '14px 16px',
                                    border: '1px solid var(--line)',
                                    background: 'linear-gradient(180deg, rgba(217,183,106,.04), transparent)',
                                }}>
                                    <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.2em', fontSize: 10, color: 'var(--gold-soft)', marginBottom: 4 }}>{tUi('purpose')}</div>
                                    <div style={{ fontFamily: '"IM Fell English", serif', fontSize: 22, color: '#f0e6cf' }}>{item.purpose}</div>
                                </div>
                                <div style={{
                                    padding: '14px 16px',
                                    border: '1px solid var(--line)',
                                    background: 'linear-gradient(180deg, rgba(217,183,106,.04), transparent)',
                                }}>
                                    <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.2em', fontSize: 10, color: 'var(--gold-soft)', marginBottom: 4 }}>{tUi('verifiedBy')}</div>
                                    <div style={{ fontFamily: '"IM Fell English", serif', fontSize: 22, color: '#f0e6cf' }}>{tUi('verifiedByCount', { count: comments?.length ?? 0 })}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Related items */}
                    {related.length > 0 && (
                        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 22 }}>
                            <div className="field-label">— {tUi('alsoFromSuit')} —</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                                {related.map((r, i) => (
                                    <ItemCard key={r.id} item={r} rotation={i % 2 ? 0.7 : -0.7} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comments */}
                    <div style={{ borderTop: '1px solid var(--line)', paddingTop: 22 }}>
                        <div className="field-label">— {tUi('marginaliaComments')} —</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {comments && comments.map(comment => (
                                <div
                                    key={comment.id}
                                    style={{
                                        padding: 16,
                                        border: '1px solid var(--line)',
                                        background: 'rgba(255,255,255,.02)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                        <div style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: '50%',
                                            border: '1px solid var(--gold-deep)',
                                            background: 'var(--velvet-3)',
                                            color: 'var(--gold-soft)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontFamily: '"IM Fell English SC", serif',
                                            fontSize: 11,
                                            letterSpacing: '0.04em',
                                            flexShrink: 0,
                                        }}>
                                            {comment.researcher.nickname.slice(0, 2).toUpperCase()}
                                        </div>
                                        <b style={{ color: '#e9dfc3', fontWeight: 500, fontFamily: '"IM Fell English", serif', fontSize: 16 }}>
                                            {comment.researcher.nickname}
                                        </b>
                                        <span style={{ marginLeft: 'auto', color: '#7a7058', fontSize: 11, fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.1em' }}>
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <div style={{ color: '#c5b890', fontSize: 15, lineHeight: 1.5, fontFamily: '"EB Garamond", serif' }}>
                                        {comment.content}
                                    </div>
                                </div>
                            ))}

                            {/* Comment form */}
                            <div style={{ paddingTop: 4 }}>
                                <CommentForm itemId={itemId} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
