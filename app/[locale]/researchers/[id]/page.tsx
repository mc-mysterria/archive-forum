'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useResearcher } from '@/lib/hooks/use-researchers'
import { useItemsByResearcher } from '@/lib/hooks/use-items'
import { useCommentsByResearcher } from '@/lib/hooks/use-comments'
import { ItemCard } from '@/components/items/item-card'
import { TarotCard } from '@/components/ui/tarot-card'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

const CARD_ROTATIONS = [-1.1, 0.6, -0.7, 0.9, -0.4, 1.0, -0.8, 0.5]

export default function ResearcherProfilePage() {
    const params = useParams()
    const t = useTranslations('researchers')
    const tComments = useTranslations('comments')
    const tUi = useTranslations('ui')
    const locale = params.locale as string
    const researcherId = parseInt(params.id as string)
    const [activeTab, setActiveTab] = useState<'items' | 'comments'>('items')

    const { data: researcher, isLoading } = useResearcher(researcherId)
    const { data: items } = useItemsByResearcher(researcherId)
    const { data: comments } = useCommentsByResearcher(researcherId)

    if (isLoading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 56, padding: '24px 56px 80px', position: 'relative', zIndex: 1 }}>
                <div style={{ aspectRatio: '5/8', background: 'var(--velvet-2)', borderRadius: 6, opacity: 0.5 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} style={{ height: 80, background: 'var(--velvet-2)', borderRadius: 4, opacity: 0.4 }} />
                    ))}
                </div>
            </div>
        )
    }

    if (!researcher) {
        return (
            <div style={{ padding: '80px 56px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.2em', color: '#7a7058' }}>
                    {t('notFound')}
                </div>
                <Link href={`/${locale}/researchers`} className="btn-velvet" style={{ display: 'inline-flex', marginTop: 20 }}>
                    {tUi('returnToClub')}
                </Link>
            </div>
        )
    }

    const initials = researcher.nickname.slice(0, 2).toUpperCase()

    return (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ padding: '22px 56px 0' }}>
                <div style={{ color: '#7a7058', fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.16em', fontSize: 12 }}>
                    <Link href={`/${locale}/researchers`} style={{ color: '#a89b78', textDecoration: 'none' }}>{t('title')}</Link>
                    {' '}· <span style={{ color: '#e9dfc3' }}>{researcher.nickname}</span>
                </div>
            </div>

            {/* Detail grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 56, padding: '24px 56px 80px' }}>
                {/* Sticky identity card */}
                <div className="tc-hover-wrap" style={{ aspectRatio: '5/8', position: 'sticky', top: 24, alignSelf: 'start' }}>
                    <TarotCard
                        rotation={-1}
                        style={{
                            height: '100%',
                            padding: '28px 22px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* Header */}
                        <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 10, color: 'var(--gold-deep)', marginBottom: 14 }}>
                            — {tUi('investigatorDossier')} —
                        </div>

                        {/* Avatar */}
                        <div style={{
                            width: 88,
                            height: 88,
                            borderRadius: '50%',
                            border: '2px solid var(--gold-deep)',
                            background: 'var(--velvet-3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: '"IM Fell English", serif',
                            fontSize: 32,
                            color: 'var(--gold-soft)',
                            boxShadow: '0 0 30px rgba(217,183,106,.18)',
                            flexShrink: 0,
                            marginBottom: 18,
                        }}>
                            {initials}
                        </div>

                        {/* Name */}
                        <div style={{
                            fontFamily: '"IM Fell English", serif',
                            fontSize: 28,
                            color: 'var(--ink)',
                            textAlign: 'center',
                            lineHeight: 1,
                            marginBottom: 6,
                        }}>
                            {researcher.nickname}
                        </div>
                        <div style={{
                            fontFamily: '"EB Garamond", serif',
                            fontStyle: 'italic',
                            color: 'var(--ink-2)',
                            fontSize: 13,
                            textAlign: 'center',
                            marginBottom: 20,
                        }}>
                            {tUi('memberOfClub')}
                        </div>

                        {/* Meta grid */}
                        <div style={{
                            width: '100%',
                            paddingTop: 16,
                            borderTop: '1px solid var(--gold-deep)',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px 14px',
                            fontFamily: '"IM Fell English SC", serif',
                            letterSpacing: '0.1em',
                            fontSize: 10,
                            color: 'var(--ink-2)',
                        }}>
                            <div>
                                <span style={{ fontSize: 9 }}>{tUi('enrolled').toUpperCase()}</span>
                                <div style={{ color: 'var(--ink)', fontSize: 12, letterSpacing: '0.04em', fontWeight: 500 }}>
                                    {formatDate(researcher.createdAt).split(',')[0]}
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: 9 }}>{tUi('cardsDrawn')}</span>
                                <div style={{ color: 'var(--ink)', fontSize: 12, letterSpacing: '0.04em', fontWeight: 500 }}>
                                    {items?.length ?? 0}
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: 9 }}>{tUi('marginalia')}</span>
                                <div style={{ color: 'var(--ink)', fontSize: 12, letterSpacing: '0.04em', fontWeight: 500 }}>
                                    {comments?.length ?? 0}
                                </div>
                            </div>
                            <div>
                                <span style={{ fontSize: 9 }}>{tUi('statusLabel')}</span>
                                <div style={{ color: 'var(--gold-soft)', fontSize: 12, letterSpacing: '0.04em', fontWeight: 500 }}>
                                    {tUi('active')}
                                </div>
                            </div>
                        </div>
                    </TarotCard>
                </div>

                {/* Scrollable body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)' }}>
                        {(['items', 'comments'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '12px 28px',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: activeTab === tab ? '2px solid var(--gold-soft)' : '2px solid transparent',
                                    color: activeTab === tab ? '#f0e6cf' : '#7a7058',
                                    fontFamily: '"IM Fell English SC", serif',
                                    letterSpacing: '0.2em',
                                    fontSize: 11,
                                    cursor: 'pointer',
                                    transition: 'color 0.15s',
                                    marginBottom: -1,
                                }}
                            >
                                {tab === 'items'
                                    ? `— ${tUi('cardsDrawn')} · ${items?.length ?? 0} —`
                                    : `— ${tUi('marginalia')} · ${comments?.length ?? 0} —`}
                            </button>
                        ))}
                    </div>

                    {/* Items tab */}
                    {activeTab === 'items' && (
                        items && items.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
                                {items.map((item, i) => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        rotation={CARD_ROTATIONS[i % CARD_ROTATIONS.length]}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.2em', fontSize: 13, color: '#7a7058' }}>
                                    {tUi('noCardDrawn')}
                                </div>
                            </div>
                        )
                    )}

                    {/* Comments tab */}
                    {activeTab === 'comments' && (
                        comments && comments.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {comments.map(comment => (
                                    <div
                                        key={comment.id}
                                        style={{
                                            padding: 16,
                                            border: '1px solid var(--line)',
                                            background: 'rgba(255,255,255,.02)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <Link
                                                href={`/${locale}/items/${comment.id}`}
                                                style={{
                                                    fontFamily: '"IM Fell English SC", serif',
                                                    letterSpacing: '0.1em',
                                                    fontSize: 11,
                                                    color: 'var(--gold-soft)',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                {tUi('onItemRef', { id: comment.id })}
                                            </Link>
                                            <span style={{ marginLeft: 'auto', color: '#7a7058', fontSize: 11, fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.1em' }}>
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <div style={{ color: '#c5b890', fontSize: 15, lineHeight: 1.5, fontFamily: '"EB Garamond", serif' }}>
                                            {comment.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.2em', fontSize: 13, color: '#7a7058' }}>
                                    {tUi('noMarginaliaWritten')}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
