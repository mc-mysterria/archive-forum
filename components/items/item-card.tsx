'use client'

import { ItemDto } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, getRarityColor, getRarityBgColor } from '@/lib/utils'
import { Calendar, User, MessageSquare, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ItemCardProps {
    item: ItemDto
}

export function ItemCard({ item }: ItemCardProps) {
    return (
        <Link href={`/items/${item.id}`}>
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full touch-manipulation">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base md:text-lg line-clamp-2">{item.name}</CardTitle>
                        {item.sequenceNumber !== undefined && (
                            <Badge variant="outline" className="shrink-0 text-xs">
                                Seq {item.sequenceNumber}
                            </Badge>
                        )}
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
    )
}