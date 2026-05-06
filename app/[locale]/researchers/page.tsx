'use client'

import { useResearchers } from '@/lib/hooks/use-researchers'
import { useItemsByResearcher } from '@/lib/hooks/use-items'
import { useCommentsByResearcher } from '@/lib/hooks/use-comments'
import { TarotCard } from '@/components/ui/tarot-card'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const ROTATIONS = [-1.1, 0.7, -0.5, 1.2, -0.8, 0.4, -1.3, 0.6]

export default function ResearchersPage() {
    const { data: researchers, isLoading } = useResearchers()
    const t = useTranslations('researchers')
    const tUi = useTranslations('ui')

    return (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
            {/* Page head */}
            <div style={{ padding: '42px 56px 24px', textAlign: 'center' }}>
                <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.4em', fontSize: 12, color: 'var(--gold-soft)' }}>
                    — {tUi('tarotClub')} —
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
                    {tUi('researchersSubtitle')}
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, padding: '8px 56px 80px' }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} style={{ aspectRatio: '5/8', background: 'var(--velvet-2)', borderRadius: 6, opacity: 0.4 }} />
                    ))}
                </div>
            ) : researchers && researchers.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, padding: '8px 56px 80px' }}>
                    {researchers.map((researcher, i) => (
                        <ResearcherCard
                            key={researcher.id}
                            researcher={researcher}
                            rotation={ROTATIONS[i % ROTATIONS.length]}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ padding: '80px 56px', textAlign: 'center' }}>
                    <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.2em', fontSize: 14, color: '#7a7058' }}>
                        {tUi('noResearchersEnrolled')}
                    </div>
                </div>
            )}
        </div>
    )
}

function ResearcherCard({ researcher, rotation }: { researcher: any; rotation: number }) {
    const { data: items } = useItemsByResearcher(researcher.id)
    const { data: comments } = useCommentsByResearcher(researcher.id)
    const tUi = useTranslations('ui')
    const tRes = useTranslations('researchers')
    const initials = researcher.nickname.slice(0, 2).toUpperCase()

    return (
        <div className="tc-hover-wrap">
            <Link href={`/researchers/${researcher.id}`} style={{ display: 'block', aspectRatio: '5/8', textDecoration: 'none' }}>
                <TarotCard
                    rotation={rotation}
                    style={{
                        height: '100%',
                        padding: '22px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* Header ornament */}
                    <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 10, color: 'var(--gold-deep)', marginBottom: 10 }}>
                        — {tUi('investigator')} —
                    </div>

                    {/* Avatar sigil */}
                    <div style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        border: '2px solid var(--gold-deep)',
                        background: 'var(--velvet-3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: '"IM Fell English", serif',
                        fontSize: 26,
                        color: 'var(--gold-soft)',
                        boxShadow: '0 0 20px rgba(217,183,106,.15)',
                        flexShrink: 0,
                        marginBottom: 14,
                    }}>
                        {initials}
                    </div>

                    {/* Name */}
                    <div style={{
                        fontFamily: '"IM Fell English", serif',
                        fontSize: 22,
                        color: 'var(--ink)',
                        textAlign: 'center',
                        lineHeight: 1.1,
                        marginBottom: 6,
                    }}>
                        {researcher.nickname}
                    </div>

                    {/* Join date */}
                    <div style={{
                        fontFamily: '"EB Garamond", serif',
                        fontStyle: 'italic',
                        color: 'var(--ink-2)',
                        fontSize: 12,
                        textAlign: 'center',
                        marginBottom: 18,
                    }}>
                        {tUi('enrolled')} {formatDate(researcher.createdAt).split(',')[0]}
                    </div>

                    {/* Divider */}
                    <div style={{ width: '80%', borderTop: '1px solid var(--gold-deep)', marginBottom: 16 }} />

                    {/* Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 10,
                        width: '100%',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            padding: '10px 8px',
                            border: '1px solid var(--line)',
                            background: 'linear-gradient(180deg, rgba(217,183,106,.04), transparent)',
                        }}>
                            <div style={{ fontFamily: '"IM Fell English", serif', fontSize: 24, color: '#f0e6cf', lineHeight: 1 }}>
                                {items?.length ?? 0}
                            </div>
                            <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.15em', fontSize: 9, color: 'var(--ink-2)', marginTop: 4 }}>
                                {tUi('cards')}
                            </div>
                        </div>
                        <div style={{
                            padding: '10px 8px',
                            border: '1px solid var(--line)',
                            background: 'linear-gradient(180deg, rgba(217,183,106,.04), transparent)',
                        }}>
                            <div style={{ fontFamily: '"IM Fell English", serif', fontSize: 24, color: '#f0e6cf', lineHeight: 1 }}>
                                {comments?.length ?? 0}
                            </div>
                            <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.15em', fontSize: 9, color: 'var(--ink-2)', marginTop: 4 }}>
                                {tUi('marginalia')}
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div style={{
                        marginTop: 'auto',
                        paddingTop: 14,
                        fontFamily: '"IM Fell English SC", serif',
                        letterSpacing: '0.2em',
                        fontSize: 10,
                        color: 'var(--gold-deep)',
                        textAlign: 'center',
                    }}>
                        — {tUi('viewDossier')} —
                    </div>
                </TarotCard>
            </Link>
        </div>
    )
}
