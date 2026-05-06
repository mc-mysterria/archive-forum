import React, { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface TarotCardProps {
    children: React.ReactNode
    rotation?: number
    className?: string
    style?: CSSProperties
    onClick?: () => void
}

export function TarotCard({
    children,
    rotation = 0,
    className = '',
    style = {},
    onClick,
}: TarotCardProps) {
    return (
        <div
            className={cn('tarot-card', className)}
            // Set rotation via CSS custom property — lets the CSS :hover rule override it
            // without fighting inline `transform` specificity
            style={{ '--tc-rot': `${rotation}deg`, ...style } as CSSProperties}
            onClick={onClick}
        >
            <span className="tc-corner tl" />
            <span className="tc-corner tr" />
            <span className="tc-corner bl" />
            <span className="tc-corner br" />
            {children}
        </div>
    )
}

/* Filigree ornament line inside a card */
export function Filigree({ sigil, size = 14 }: { sigil?: string; size?: number }) {
    return (
        <div
            style={{
                color: 'var(--gold-deep)',
                fontFamily: '"IM Fell English", serif',
                textAlign: 'center',
                lineHeight: 1,
                fontSize: size,
                letterSpacing: '0.4em',
            }}
        >
            ✦ {sigil ?? '·'} ✦
        </div>
    )
}

/* Sigil ring (unicode glyph in a circle) */
export function SigilRing({
    glyph,
    size = 'md',
    color,
    style,
}: {
    glyph: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    color?: string
    style?: CSSProperties
}) {
    return (
        <div
            className={`sigil-ring ${size}`}
            style={{ color: color ?? 'var(--gold-soft)', ...style }}
        >
            {glyph}
        </div>
    )
}
