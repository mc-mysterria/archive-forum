'use client'

import {useResearchers} from '@/lib/hooks/use-researchers'
import {useItemsByResearcher} from '@/lib/hooks/use-items'
import {useCommentsByResearcher} from '@/lib/hooks/use-comments'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Avatar, AvatarFallback} from '@/components/ui/avatar'
import {Button} from '@/components/ui/button'
import {BookOpen, Calendar, MessageSquare, Users} from 'lucide-react'
import {formatDate} from '@/lib/utils'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function ResearchersPage() {
    const {data: researchers, isLoading} = useResearchers()
    const t = useTranslations('researchers')

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('subtitle')}
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="h-48"/>
                        </Card>
                    ))}
                </div>
            ) : researchers && researchers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {researchers.map((researcher) => (
                        <ResearcherCard key={researcher.id} researcher={researcher}/>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
                        <p className="text-muted-foreground">{t('noResearchers')}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function ResearcherCard({researcher}: { researcher: any }) {
    const {data: items} = useItemsByResearcher(researcher.id)
    const {data: comments} = useCommentsByResearcher(researcher.id)
    const t = useTranslations('researchers')

    return (
        <Card className="hover:shadow-lg transition-all">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback>
                            {researcher.nickname.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{researcher.nickname}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                            <Calendar className="h-3 w-3"/>
                            {t('joined')} {formatDate(researcher.createdAt)}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{items?.length || 0}</div>
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <BookOpen className="h-3 w-3"/>
                            Items
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{comments?.length || 0}</div>
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <MessageSquare className="h-3 w-3"/>
                            Comments
                        </div>
                    </div>
                </div>
                <Link href={`/researchers/${researcher.id}`}>
                    <Button variant="outline" className="w-full">
                        {t('viewProfile')}
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}