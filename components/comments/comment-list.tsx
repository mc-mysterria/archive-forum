'use client'

import { CommentDto } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useDeleteComment } from '@/lib/hooks/use-comments'
import { useResearcherStore } from '@/lib/store/researcher-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface CommentListProps {
    comments: CommentDto[]
}

export function CommentList({ comments }: CommentListProps) {
    const { researcher } = useResearcherStore()
    const { user, canModerate } = useAuth()
    const deleteComment = useDeleteComment()

    const canDeleteComment = (comment: CommentDto) => {
        if (!user) return false
        // User can delete if they created the comment or have moderate permissions
        return user.id.toString() === comment.researcher.id.toString() || canModerate()
    }

    if (comments.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                        No comments yet. Be the first to share your thoughts!
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <Card key={comment.id}>
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <Avatar>
                                <AvatarFallback>
                                    {comment.researcher.nickname.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                    <span className="font-semibold">
                      {comment.researcher.nickname}
                    </span>
                                        <span className="text-xs text-muted-foreground ml-2">
                      {formatDate(comment.createdAt)}
                    </span>
                                    </div>
                                    {canDeleteComment(comment) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteComment.mutate(comment.id)}
                                            disabled={deleteComment.isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}