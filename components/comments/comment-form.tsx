'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCreateComment } from '@/lib/hooks/use-comments'
import { useAuth } from '@/lib/hooks/use-auth'

interface CommentFormProps {
    itemId: number
}

export function CommentForm({ itemId }: CommentFormProps) {
    const [content, setContent] = useState('')
    const t = useTranslations('comments')
    const { isAuthenticated, user, canWrite } = useAuth()
    const createComment = useCreateComment()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !content.trim()) return
        try {
            await createComment.mutateAsync({
                content,
                itemId,
                researcherId: parseInt(user.id.toString()),
            })
            setContent('')
        } catch (error) {
            console.error('Failed to create comment:', error)
        }
    }

    if (!isAuthenticated) {
        return (
            <div style={{
                padding: '16px',
                border: '1px solid var(--line)',
                background: 'rgba(255,255,255,.02)',
                textAlign: 'center',
                fontFamily: '"EB Garamond", serif',
                fontStyle: 'italic',
                color: '#7a7058',
                fontSize: 15,
            }}>
                {t('loginToLeaveMarginalia')}
            </div>
        )
    }

    if (!canWrite()) {
        return (
            <div style={{
                padding: '16px',
                border: '1px solid var(--line)',
                textAlign: 'center',
                fontFamily: '"EB Garamond", serif',
                fontStyle: 'italic',
                color: '#7a7058',
                fontSize: 15,
            }}>
                {t('noPermissionMarginalia')}
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: 12 }}>
                {/* Avatar placeholder */}
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
                    flexShrink: 0,
                    marginTop: 2,
                }}>
                    {user?.username?.slice(0, 2).toUpperCase() ?? '?'}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <textarea
                        placeholder={t('placeholder')}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                        maxLength={2000}
                        style={{
                            flex: 1,
                            minHeight: 80,
                            padding: '12px 14px',
                            background: 'var(--velvet-2)',
                            border: '1px solid var(--line)',
                            color: '#e9dfc3',
                            fontFamily: '"EB Garamond", serif',
                            fontSize: 15,
                            fontStyle: 'italic',
                            resize: 'vertical',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold-soft)' }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'var(--line)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: '"IM Fell English SC", serif', letterSpacing: '0.1em', fontSize: 10, color: '#7a7058' }}>
                            {content.length}/2000
                        </span>
                        <button
                            type="submit"
                            disabled={createComment.isPending || !content.trim()}
                            className="btn-velvet primary"
                        >
                            {createComment.isPending ? t('sealing') : t('sealAndSubmit')}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
