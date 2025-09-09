'use client'

import { useState } from 'react'
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
                        Please select a researcher nickname to comment
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                placeholder="Share your thoughts about this item..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                maxLength={2000}
                required
            />
            <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {content.length}/2000 characters
        </span>
                <Button type="submit" disabled={createComment.isPending}>
                    {createComment.isPending ? 'Posting...' : 'Post Comment'}
                </Button>
            </div>
        </form>
    )
}