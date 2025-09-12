'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCreateComment } from '@/lib/hooks/use-comments'
import { useResearcherStore } from '@/lib/store/researcher-store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

interface CommentFormProps {
    itemId: number
}

export function CommentForm({ itemId }: CommentFormProps) {
    const [content, setContent] = useState('')
    const t = useTranslations('comments')
    const { researcher } = useResearcherStore()
    const createComment = useCreateComment()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!researcher || !content.trim()) return

        try {
            await createComment.mutateAsync({
                content,
                itemId,
                researcherId: researcher.id,
            })
            setContent('')
        } catch (error) {
            console.error('Failed to create comment:', error)
        }
    }

    if (!researcher) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground text-center">
                        {t('selectResearcherToComment')}
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                placeholder={t('placeholder')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                maxLength={2000}
                required
            />
            <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {content.length}/2000 {t('charactersLeft')}
        </span>
                <Button type="submit" disabled={createComment.isPending}>
                    {createComment.isPending ? t('posting') : t('postComment')}
                </Button>
            </div>
        </form>
    )
}