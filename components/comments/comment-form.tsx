'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCreateComment } from '@/lib/hooks/use-comments'
import { useResearcherStore } from '@/lib/store/researcher-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

interface CommentFormProps {
    itemId: number
}

export function CommentForm({ itemId }: CommentFormProps) {
    const [content, setContent] = useState('')
    const t = useTranslations('comments')
    const { researcher } = useResearcherStore()
    const { isAuthenticated, user, canWrite } = useAuth()
    const createComment = useCreateComment()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !content.trim()) return

        try {
            await createComment.mutateAsync({
                content,
                itemId,
                researcherId: researcher?.id || parseInt(user.id.toString()), // Ensure it's a number
            })
            setContent('')
        } catch (error) {
            console.error('Failed to create comment:', error)
        }
    }

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <Card>
                <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        Please log in to post comments
                    </p>
                    <Link href="/login">
                        <Button variant="outline" size="sm">
                            <LogIn className="h-4 w-4 mr-2" />
                            Login
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    // Authenticated but no write permissions
    if (!canWrite()) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground text-center">
                        You don&apos;t have permission to post comments
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
                <Button type="submit" disabled={createComment.isPending || !content.trim()}>
                    {createComment.isPending ? t('posting') : t('postComment')}
                </Button>
            </div>
        </form>
    )
}