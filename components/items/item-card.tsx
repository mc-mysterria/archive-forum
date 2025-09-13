'use client'

import { ItemDto } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, getRarityColor, getRarityBgColor } from '@/lib/utils'
import { Calendar, User, MessageSquare, Sparkles, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/hooks/use-auth'
import { useDeleteItem } from '@/lib/hooks/use-items'
import { useRouter } from 'next/navigation'

interface ItemCardProps {
    item: ItemDto
}

export function ItemCard({ item }: ItemCardProps) {
    const { user, canModerate } = useAuth()
    const deleteItem = useDeleteItem()
    const router = useRouter()

    const canEdit = () => {
        if (!user || !item) return false
        return user.id.toString() === item.researcher.id.toString() || canModerate()
    }

    const canDelete = () => {
        if (!user || !item) return false
        return user.id.toString() === item.researcher.id.toString() || canModerate()
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation
        e.stopPropagation()

        if (!confirm('Are you sure you want to delete this item?')) return

        try {
            await deleteItem.mutateAsync(item.id)
        } catch (error) {
            console.error('Failed to delete item:', error)
        }
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`/items/${item.id}/edit`)
    }

    return (
        <div className="relative group">
            <Link href={`/items/${item.id}`}>
                <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full touch-manipulation">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-base md:text-lg line-clamp-2">{item.name}</CardTitle>
                            <div className="flex items-center gap-1">
                                {item.sequenceNumber !== undefined && (
                                    <Badge variant="outline" className="shrink-0 text-xs">
                                        Seq {item.sequenceNumber}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                <CardContent className="space-y-3 pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.description || 'No description available'}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                        {item.pathway && (
                            <Badge variant="secondary" className="text-xs">
                                {item.pathway.name}
                            </Badge>
                        )}
                        {item.type && (
                            <Badge variant="outline" className="text-xs">
                                {item.type.name}
                            </Badge>
                        )}
                        {item.rarity && (
                            <Badge
                                className={cn(
                                    "text-xs",
                                    getRarityBgColor(item.rarity),
                                    getRarityColor(item.rarity)
                                )}
                            >
                                <Sparkles className="h-3 w-3 mr-1" />
                                {item.rarity}
                            </Badge>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground pt-3">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3 md:gap-4">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                  <span className="truncate max-w-20 md:max-w-none">{item.researcher.nickname}</span>
              </span>
                            <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                                {item.comments?.length || 0}
              </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
                            <span className="hidden sm:inline">{formatDate(item.createdAt)}</span>
            </span>
                    </div>
                </CardFooter>
            </Card>
            </Link>

            {/* Action buttons - only show for creators/moderators */}
            {(canEdit() || canDelete()) && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    {canEdit() && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleEdit}
                            disabled={deleteItem.isPending}
                            className="h-8 w-8 p-0"
                        >
                            <Edit className="h-3 w-3" />
                        </Button>
                    )}
                    {canDelete() && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            disabled={deleteItem.isPending}
                            className="h-8 w-8 p-0"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}