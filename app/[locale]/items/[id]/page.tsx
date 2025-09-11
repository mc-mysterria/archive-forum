'use client'

import { useParams, useRouter } from 'next/navigation'
import { useItem, useDeleteItem } from '@/lib/hooks/use-items'
import { useCommentsByItem } from '@/lib/hooks/use-comments'
import { CommentForm } from '@/components/comments/comment-form'
import { CommentList } from '@/components/comments/comment-list'
import { useResearcherStore } from '@/lib/store/researcher-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate, getRarityColor, getRarityBgColor } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
    Calendar,
    User,
    Sparkles,
    Edit,
    Trash2,
    ChevronLeft,
    MessageSquare
} from 'lucide-react'
import Link from 'next/link'

export default function ItemDetailPage() {
    const params = useParams()
    const router = useRouter()
    const itemId = parseInt(params.id as string)

    const { data: item, isLoading } = useItem(itemId)
    const { data: comments } = useCommentsByItem(itemId)
    const deleteItem = useDeleteItem()
    const { researcher } = useResearcherStore()

    const canEdit = researcher && item && researcher.id === item.researcher.id

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this item?')) return

        try {
            await deleteItem.mutateAsync(itemId)
            router.push('/items')
        } catch (error) {
            console.error('Failed to delete item:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="animate-pulse">
                    <CardContent className="h-96" />
                </Card>
            </div>
        )
    }

    if (!item) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-muted-foreground">Item not found</p>
                        <Link href="/items">
                            <Button className="mt-4">Back to Items</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <Link href="/items">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Items
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <CardTitle className="text-3xl">{item.name}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                {item.pathway && (
                                    <Badge variant="secondary">
                                        {item.pathway.name}
                                    </Badge>
                                )}
                                {item.type && (
                                    <Badge variant="outline">
                                        {item.type.name}
                                    </Badge>
                                )}
                                {item.sequenceNumber !== undefined && (
                                    <Badge variant="outline">
                                        Sequence {item.sequenceNumber}
                                    </Badge>
                                )}
                                {item.rarity && (
                                    <Badge
                                        className={cn(
                                            getRarityBgColor(item.rarity),
                                            getRarityColor(item.rarity)
                                        )}
                                    >
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        {item.rarity}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        {canEdit && (
                            <div className="flex gap-2">
                                <Link href={`/items/${item.id}/edit`}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {item.description || 'No description provided'}
                        </p>
                    </div>

                    {item.purpose && (
                        <div>
                            <h3 className="font-semibold mb-2">Purpose</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {item.purpose}
                            </p>
                        </div>
                    )}

                    {item.pathway && (
                        <div>
                            <h3 className="font-semibold mb-2">Pathway Details</h3>
                            <Card>
                                <CardContent className="pt-6">
                                    <h4 className="font-semibold">{item.pathway.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {item.pathway.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Sequences: 0-{item.pathway.sequenceCount}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Discovered by {item.researcher.nickname}
              </span>
                        </div>
                        <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                  {formatDate(item.createdAt)}
              </span>
                            {item.updatedAt !== item.createdAt && (
                                <span className="text-xs">
                  (Updated {formatDate(item.updatedAt)})
                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8 space-y-6">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <h2 className="text-2xl font-bold">
                        Comments ({comments?.length || 0})
                    </h2>
                </div>

                <CommentForm itemId={itemId} />

                {comments && <CommentList comments={comments} />}
            </div>
        </div>
    )
}