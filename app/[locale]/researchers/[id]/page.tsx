'use client'

import { useParams } from 'next/navigation'
import { useResearcher } from '@/lib/hooks/use-researchers'
import { useItemsByResearcher } from '@/lib/hooks/use-items'
import { useCommentsByResearcher } from '@/lib/hooks/use-comments'
import { ItemCard } from '@/components/items/item-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, ChevronLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function ResearcherProfilePage() {
    const params = useParams()
    const researcherId = parseInt(params.id as string)

    const { data: researcher, isLoading } = useResearcher(researcherId)
    const { data: items } = useItemsByResearcher(researcherId)
    const { data: comments } = useCommentsByResearcher(researcherId)

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="animate-pulse">
                    <CardContent className="h-96" />
                </Card>
            </div>
        )
    }

    if (!researcher) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-muted-foreground">Researcher not found</p>
                        <Link href="/researchers">
                            <Button className="mt-4">Back to Researchers</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-6">
                <Link href="/researchers">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Researchers
                    </Button>
                </Link>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="text-2xl">
                                {researcher.nickname.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{researcher.nickname}</CardTitle>
                            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                Researcher since {formatDate(researcher.createdAt)}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-center">
                                    {items?.length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    Items Created
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-2xl font-bold text-center">
                                    {comments?.length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    Comments
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="items">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="items">Items ({items?.length || 0})</TabsTrigger>
                    <TabsTrigger value="comments">Comments ({comments?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="mt-6">
                    {items && items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-muted-foreground">No items created yet</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="comments" className="mt-6">
                    {comments && comments.length > 0 ? (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <Card key={comment.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <Link href={`/items/${comment.id}`} className="font-semibold hover:underline">
                                                Item #{comment.id}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                                        </div>
                                        <p className="text-sm">{comment.content}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-muted-foreground">No comments yet</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}