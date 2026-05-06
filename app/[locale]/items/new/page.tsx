'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCreateItem } from '@/lib/hooks/use-items'
import { usePathways } from '@/lib/hooks/use-pathways'
import { useTypes } from '@/lib/hooks/use-types'
import { useAuth } from '@/lib/hooks/use-auth'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { TarotCard, Filigree, SigilRing } from '@/components/ui/tarot-card'
import { getPathwayTheme, getRarityMeta, toRoman } from '@/lib/pathway-theme'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { getLocalizedPathwayName } from '@/lib/pathway-theme'

const RARITIES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHICAL']
const SEQUENCES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const GLYPH_CHOICES = ['☽','♣','✶','♥','☠','♪','◆','☗','✦','☄','⚿','◇','∿','✺','⚘','☉','⌘','†','♆','∅','◐','※','☥','⚸','⛓','♢','♧','✧','☯','✷']

const STEP_ROMANS = ['I', 'II', 'III', 'IV']

interface DraftState {
    name: string
    description: string
    purpose: string
    pathwayId: string
    typeId: string
    sequenceNumber: string
    rarity: string
    glyph: string
}

export default function NewItemPage() {
    const router = useRouter()
    const t = useTranslations('items')
    const tNew = useTranslations('newItem')
    const locale = useLocale()
    const STEPS = [
        { roman: 'I',   label: tNew('stepInscription') },
        { roman: 'II',  label: tNew('stepProperties') },
        { roman: 'III', label: tNew('stepLore') },
        { roman: 'IV',  label: tNew('stepSeal') },
    ]
    const createItem = useCreateItem()
    const { data: pathways } = usePathways()
    const { data: types } = useTypes()
    const { user } = useAuth()

    const [draft, setDraft] = useState<DraftState>({
        name: '',
        description: '',
        purpose: '',
        pathwayId: 'none',
        typeId: 'none',
        sequenceNumber: 'none',
        rarity: 'none',
        glyph: '✦',
    })

    const set = (key: keyof DraftState, value: string) =>
        setDraft(prev => ({ ...prev, [key]: value }))

    const selectedPathway = pathways?.find(p => p.id.toString() === draft.pathwayId)
    const theme = getPathwayTheme(selectedPathway?.name)
    const rarityMeta = getRarityMeta(draft.rarity !== 'none' ? draft.rarity : undefined)
    const seqNum = draft.sequenceNumber !== 'none' ? parseInt(draft.sequenceNumber) : undefined
    const seqRoman = seqNum !== undefined ? toRoman(seqNum) : '—'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        try {
            const newItem = await createItem.mutateAsync({
                name: draft.name,
                description: draft.description || undefined,
                purpose: draft.purpose || undefined,
                pathwayId: draft.pathwayId !== 'none' ? parseInt(draft.pathwayId) : undefined,
                typeId: draft.typeId !== 'none' ? parseInt(draft.typeId) : undefined,
                sequenceNumber: draft.sequenceNumber !== 'none' ? parseInt(draft.sequenceNumber) : undefined,
                rarity: draft.rarity !== 'none' ? draft.rarity : undefined,
                researcherId: parseInt(user.id.toString()),
            })
            router.push(`/${locale}/items/${newItem.id}`)
        } catch (error) {
            console.error('Failed to create item:', error)
        }
    }

    return (
        <ProtectedRoute requiredPermission="PERM_ARCHIVE:WRITE">
            <div style={{ maxWidth: 980, margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>
                {/* Hero */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.4em', fontSize: 12, color: 'var(--gold-soft)' }}>
                        — {tNew('heroLabel')} —
                    </div>
                    <h1 style={{
                        fontFamily: '"IM Fell English", serif',
                        fontWeight: 400,
                        color: '#f0e6cf',
                        fontSize: 56,
                        lineHeight: 1,
                        margin: '8px 0',
                    }}>
                        {tNew('title')}
                    </h1>
                    <p style={{ fontStyle: 'italic', color: '#a89b78', maxWidth: 560, margin: '6px auto 0', fontFamily: '"EB Garamond", serif' }}>
                        {tNew('description')}
                    </p>
                </div>

                {/* Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '30px 0 40px' }}>
                    {STEPS.map((step, i) => (
                        <div key={step.roman} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: i === 0 ? 'var(--gold-soft)' : '#7a7058', fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.16em', fontSize: 11 }}>
                                <div className={`step-dot${i === 0 ? ' active' : ''}`}>{step.roman}</div>
                                {step.label}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div style={{ width: 36, height: 1, background: 'var(--line)' }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form + preview */}
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 56, alignItems: 'start' }}>
                        {/* Form fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
                            {/* Name */}
                            <div>
                                <label style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 11, color: 'var(--gold-soft)', display: 'block', marginBottom: 10 }}>
                                    — {tNew('nameLabel')} —
                                </label>
                                <input
                                    type="text"
                                    value={draft.name}
                                    onChange={e => set('name', e.target.value)}
                                    placeholder={tNew('namePlaceholder')}
                                    required
                                    minLength={2}
                                    maxLength={100}
                                    className="velvet-input"
                                />
                                <div style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', color: '#7a7058', fontSize: 13, marginTop: 6 }}>
                                    {tNew('nameHint')}
                                </div>
                            </div>

                            {/* Type */}
                            {types && types.length > 0 && (
                                <div>
                                    <label style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 11, color: 'var(--gold-soft)', display: 'block', marginBottom: 10 }}>
                                        — {tNew('typeLabel')} —
                                    </label>
                                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                        {types.map(type => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => set('typeId', type.id.toString())}
                                                style={{
                                                    padding: '8px 14px',
                                                    border: `1px solid ${draft.typeId === type.id.toString() ? 'var(--gold-soft)' : 'var(--line)'}`,
                                                    background: draft.typeId === type.id.toString() ? 'rgba(217,183,106,.08)' : 'transparent',
                                                    color: draft.typeId === type.id.toString() ? 'var(--gold-soft)' : '#c5b890',
                                                    fontFamily: '"IM Fell English SC", serif',
                                                    letterSpacing: '0.16em',
                                                    fontSize: 11,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <span style={{
                                                    width: 8, height: 8, borderRadius: '50%',
                                                    background: 'currentColor',
                                                    boxShadow: '0 0 10px currentColor',
                                                }} />
                                                {type.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pathway */}
                            {pathways && pathways.length > 0 && (
                                <div>
                                    <label style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 11, color: 'var(--gold-soft)', display: 'block', marginBottom: 10 }}>
                                        — {tNew('suitPathwayLabel')} —
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                        {pathways.map(p => {
                                            const pt = getPathwayTheme(p.name)
                                            const selected = draft.pathwayId === p.id.toString()
                                            return (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => set('pathwayId', p.id.toString())}
                                                    style={{
                                                        padding: 10,
                                                        border: `1px solid ${selected ? 'var(--gold-soft)' : 'var(--line)'}`,
                                                        background: selected ? 'rgba(217,183,106,.08)' : 'rgba(255,255,255,.02)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        cursor: 'pointer',
                                                        color: selected ? '#f0e6cf' : '#c5b890',
                                                        fontFamily: '"IM Fell English", serif',
                                                        fontSize: 13,
                                                        transition: 'all 0.15s',
                                                    }}
                                                >
                                                    <span style={{
                                                        width: 24, height: 24, borderRadius: '50%',
                                                        border: `1px solid ${pt.color}`,
                                                        color: pt.color,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontFamily: '"IM Fell English", serif',
                                                        fontSize: 13,
                                                        flexShrink: 0,
                                                    }}>
                                                        {pt.sigil}
                                                    </span>
                                                    <span>{getLocalizedPathwayName(p.name, locale)}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Sequence */}
                            <div>
                                <label style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 11, color: 'var(--gold-soft)', display: 'block', marginBottom: 10 }}>
                                    — {tNew('sequenceLabel')} —
                                </label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {SEQUENCES.map(seq => (
                                        <button
                                            key={seq}
                                            type="button"
                                            onClick={() => set('sequenceNumber', seq.toString())}
                                            className={`seq-num${draft.sequenceNumber === seq.toString() ? ' active' : ''}`}
                                        >
                                            {seq}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rarity */}
                            <div>
                                <label style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 11, color: 'var(--gold-soft)', display: 'block', marginBottom: 10 }}>
                                    — {tNew('rarityLabel')} —
                                </label>
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    {RARITIES.map(rarity => {
                                        const meta = getRarityMeta(rarity)
                                        const selected = draft.rarity === rarity
                                        return (
                                            <button
                                                key={rarity}
                                                type="button"
                                                onClick={() => set('rarity', rarity)}
                                                style={{
                                                    padding: '8px 14px',
                                                    border: `1px solid ${selected ? 'var(--gold-soft)' : 'var(--line)'}`,
                                                    background: selected ? 'rgba(217,183,106,.06)' : 'transparent',
                                                    color: selected ? 'var(--gold-soft)' : meta.color,
                                                    fontFamily: '"IM Fell English SC", serif',
                                                    letterSpacing: '0.16em',
                                                    fontSize: 11,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color, boxShadow: `0 0 10px ${meta.color}` }} />
                                                {rarity.charAt(0) + rarity.slice(1).toLowerCase()}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Glyph picker */}
                            <div>
                                <label style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 11, color: 'var(--gold-soft)', display: 'block', marginBottom: 10 }}>
                                    — {tNew('sigilLabel')} —
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {GLYPH_CHOICES.map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => set('glyph', g)}
                                            className={`glyph-opt${draft.glyph === g ? ' active' : ''}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', color: '#7a7058', fontSize: 13, marginTop: 6 }}>
                                    {tNew('sigilHint')}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.3em', fontSize: 11, color: 'var(--gold-soft)', display: 'block', marginBottom: 10 }}>
                                    — {tNew('descriptionLabel')} —
                                </label>
                                <textarea
                                    value={draft.description}
                                    onChange={e => set('description', e.target.value)}
                                    placeholder={tNew('descriptionPlaceholder')}
                                    maxLength={2000}
                                    className="velvet-input"
                                    style={{ minHeight: 110, resize: 'vertical', fontStyle: 'italic' }}
                                />
                                <div style={{ fontFamily: '"EB Garamond", serif', fontStyle: 'italic', color: '#7a7058', fontSize: 13, marginTop: 6 }}>
                                    {tNew('descriptionHint')}
                                </div>
                            </div>

                            {/* Footer actions */}
                            <div style={{
                                marginTop: 36,
                                paddingTop: 24,
                                borderTop: '1px solid var(--line)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <Link href="/items" className="btn-velvet ghost">{tNew('cancelButton')}</Link>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button type="button" className="btn-velvet">{tNew('saveDraft')}</button>
                                    <button
                                        type="submit"
                                        disabled={createItem.isPending || !draft.name}
                                        className="btn-velvet primary"
                                    >
                                        {createItem.isPending ? tNew('sealing') : tNew('sealAndSubmit')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Live preview card */}
                        <div style={{ position: 'sticky', top: 24 }}>
                            <div className="tc-hover-wrap" style={{ aspectRatio: '5/8' }}>
                                <TarotCard
                                    rotation={1}
                                    style={{
                                        height: '100%',
                                        padding: '24px 22px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* Top row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <div style={{ fontFamily: '"IM Fell English SC", serif', fontSize: 13, color: 'var(--gold-deep)', letterSpacing: '0.08em' }}>
                                            — {seqRoman} —
                                        </div>
                                        <div style={{ fontFamily: '"IM Fell English SC", serif', fontSize: 13, color: 'var(--gold-deep)', letterSpacing: '0.08em' }}>
                                            — {theme.abbr} —
                                        </div>
                                    </div>

                                    <Filigree sigil={theme.sigil} size={13} />

                                    {/* Glyph */}
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <SigilRing glyph={draft.glyph} size="xl" color={theme.color} />
                                    </div>

                                    <Filigree sigil={theme.sigil} size={13} />

                                    {/* Name */}
                                    <div style={{
                                        fontFamily: '"IM Fell English", serif',
                                        fontSize: 20,
                                        color: 'var(--ink)',
                                        textAlign: 'center',
                                        lineHeight: 1,
                                        marginTop: 8,
                                    }}>
                                        {draft.name || tNew('untitledCard')}
                                    </div>
                                    <div style={{
                                        fontFamily: '"IM Fell English SC", serif',
                                        letterSpacing: '0.18em',
                                        fontSize: 10,
                                        color: theme.color,
                                        marginTop: 4,
                                        textAlign: 'center',
                                    }}>
                                        · {getLocalizedPathwayName(selectedPathway?.name, locale)} · SEQ. {seqRoman} ·
                                    </div>

                                    {/* Footer */}
                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: 10,
                                        borderTop: '1px solid var(--gold-deep)',
                                        width: '80%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 9,
                                        color: 'var(--ink-2)',
                                        fontFamily: '"IM Fell English SC", serif',
                                        letterSpacing: '0.1em',
                                    }}>
                                        <span>{draft.rarity !== 'none' ? draft.rarity.charAt(0) + draft.rarity.slice(1).toLowerCase() : tNew('rarityPlaceholder')}</span>
                                        <span>{draft.typeId !== 'none' && types ? types.find(ty => ty.id.toString() === draft.typeId)?.name ?? '—' : tNew('typePlaceholder')}</span>
                                    </div>
                                </TarotCard>
                            </div>
                            <div style={{
                                textAlign: 'center',
                                marginTop: 14,
                                fontFamily: '"IM Fell English SC", serif',
                                letterSpacing: '0.32em',
                                fontSize: 10,
                                color: 'var(--gold-soft)',
                            }}>
                                — {tNew('liveInscription')} —
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </ProtectedRoute>
    )
}
