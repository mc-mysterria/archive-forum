'use client'

import { useState } from 'react'
import { usePathways, useCreatePathway } from '@/lib/hooks/use-pathways'
import { useItemsByPathway } from '@/lib/hooks/use-items'
import { useAuth } from '@/lib/hooks/use-auth'
import { TarotCard, SigilRing } from '@/components/ui/tarot-card'
import { getPathwayTheme, ROMAN } from '@/lib/pathway-theme'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { getLocalizedPathwayName } from '@/lib/pathway-theme'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PathwayDto } from '@/lib/types'

const ARCANA_ROTATIONS = [-1, 0.6, -0.5, 1]

export default function PathwaysPage() {
    const { data: pathways, isLoading } = usePathways()
    const createPathway = useCreatePathway()
    const { canModerate } = useAuth()
    const t = useTranslations('pathways')
    const tUi = useTranslations('ui')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [formData, setFormData] = useState({ name: '', description: '', sequenceCount: '9' })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createPathway.mutateAsync({
                name: formData.name,
                description: formData.description || undefined,
                sequenceCount: parseInt(formData.sequenceCount),
            })
            setDialogOpen(false)
            setFormData({ name: '', description: '', sequenceCount: '9' })
        } catch (error) {
            console.error('Failed to create pathway:', error)
        }
    }

    return (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
            {/* Page head */}
            <div style={{ padding: '42px 56px 24px', textAlign: 'center' }}>
                <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.4em', fontSize: 12, color: 'var(--gold-soft)' }}>
                    — {tUi('majorArcana')} —
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
                    {tUi('pathwaysSubtitle')}
                </div>
                {canModerate() && (
                    <div style={{ marginTop: 20 }}>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <button className="btn-velvet">{t('addPathway')}</button>
                            </DialogTrigger>
                            <DialogContent>
                                <form onSubmit={handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>{t('createNew')}</DialogTitle>
                                        <DialogDescription>{t('createNewDesc')}</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">{t('nameRequired')}</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder={t('namePlaceholder')}
                                                minLength={2}
                                                maxLength={100}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">{t('description')}</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                placeholder={t('descPlaceholder')}
                                                rows={3}
                                                maxLength={2000}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="sequenceCount">{t('sequenceCount')}</Label>
                                            <Input
                                                id="sequenceCount"
                                                type="number"
                                                value={formData.sequenceCount}
                                                onChange={e => setFormData({ ...formData, sequenceCount: e.target.value })}
                                                min="1"
                                                max="9"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={createPathway.isPending}>
                                            {createPathway.isPending ? t('creating') : t('createPathway')}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            {/* Arcana grid */}
            {isLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, padding: '8px 56px 80px' }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} style={{ aspectRatio: '5/8', background: 'var(--velvet-2)', borderRadius: 6, opacity: 0.4 }} />
                    ))}
                </div>
            ) : pathways && pathways.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, padding: '8px 56px 80px' }}>
                    {pathways.map((pathway, i) => (
                        <ArcanaCard
                            key={pathway.id}
                            pathway={pathway}
                            index={i}
                            rotation={ARCANA_ROTATIONS[i % 4]}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ padding: '80px 56px', textAlign: 'center' }}>
                    <div style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.2em', fontSize: 14, color: '#7a7058' }}>
                        {tUi('noPathwaysInscribed')}
                    </div>
                    {canModerate() && (
                        <button className="btn-velvet" style={{ marginTop: 20 }} onClick={() => setDialogOpen(true)}>
                            {t('createFirst')}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

function ArcanaCard({ pathway, index, rotation }: { pathway: PathwayDto; index: number; rotation: number }) {
    const { data: items } = useItemsByPathway(pathway.id)
    const theme = getPathwayTheme(pathway.name)
    const roman = ROMAN[index] ?? String(index + 1)
    const itemCount = items?.length ?? pathway.sequenceCount ?? 0
    const tUi = useTranslations('ui')
    const locale = useLocale()
    const localizedName = getLocalizedPathwayName(pathway.name, locale)

    return (
        <div className="tc-hover-wrap">
        <Link
            href={`/items?pathway=${pathway.id}`}
            style={{ display: 'block', aspectRatio: '5/8', textDecoration: 'none' }}
        >
            <TarotCard
                rotation={rotation}
                style={{
                    height: '100%',
                    padding: '18px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* Roman numeral */}
                <div style={{ fontFamily: '"IM Fell English", serif', fontSize: 24, color: 'var(--gold-deep)', letterSpacing: '0.16em' }}>
                    — {roman} —
                </div>

                {/* Filigree */}
                <div style={{ fontFamily: '"IM Fell English", serif', fontSize: 14, letterSpacing: '0.5em', marginTop: 6, color: 'var(--gold-deep)' }}>
                    ✦ {theme.sigil} ✦
                </div>

                {/* Pathway artwork */}
                <div style={{
                    width: '100%',
                    height: 130,
                    margin: '10px 0',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    flexShrink: 0,
                }}>
                    {theme.image ? (
                        <>
                            <img
                                src={theme.image}
                                alt={pathway.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center top',
                                    display: 'block',
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: `linear-gradient(to bottom, rgba(18,10,8,.55) 0%, transparent 30%, transparent 65%, rgba(18,10,8,.8) 100%),
                                             linear-gradient(to right, rgba(18,10,8,.3) 0%, transparent 20%, transparent 80%, rgba(18,10,8,.3) 100%)`,
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: 6,
                                right: 8,
                                fontFamily: '"IM Fell English", serif',
                                fontSize: 18,
                                color: theme.color,
                                opacity: 0.9,
                                textShadow: '0 0 8px rgba(0,0,0,.8)',
                            }}>
                                {theme.sigil}
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <SigilRing glyph={theme.sigil} size="xl" color={theme.color} />
                        </div>
                    )}
                </div>

                {/* Name */}
                <div style={{
                    fontFamily: '"IM Fell English", serif',
                    fontSize: 22,
                    color: 'var(--ink)',
                    textAlign: 'center',
                    lineHeight: 1,
                    marginBottom: 6,
                }}>
                    {localizedName}
                </div>

                {/* Subtitle */}
                <div style={{
                    fontFamily: '"EB Garamond", serif',
                    fontStyle: 'italic',
                    color: 'var(--ink-2)',
                    textAlign: 'center',
                    marginBottom: 18,
                    fontSize: 13,
                }}>
                    — {localizedName.toLowerCase()} —
                </div>

                {/* Pip row */}
                <div className="pip-row">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <div key={n} className={`pip${n >= 6 ? ' on' : ''}`} />
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: 'auto',
                    paddingTop: 14,
                    borderTop: '1px solid var(--gold-deep)',
                    width: '80%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <span style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.14em', fontSize: 11, color: 'var(--ink-2)' }}>
                        {tUi('cardsCount', { count: itemCount })}
                    </span>
                    <span style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.14em', fontSize: 11, color: theme.color }}>
                        {tUi('traceArrow')}
                    </span>
                </div>
            </TarotCard>
        </Link>
        </div>
    )
}
