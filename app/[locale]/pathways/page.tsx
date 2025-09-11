'use client'

import { useState } from 'react'
import { usePathways, useCreatePathway } from '@/lib/hooks/use-pathways'
import { useItemsByPathway } from '@/lib/hooks/use-items'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Compass, Plus, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function PathwaysPage() {
    const { data: pathways, isLoading } = usePathways()
    const createPathway = useCreatePathway()
    const t = useTranslations('pathways')
    const tCommon = useTranslations('common')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        sequenceCount: '9',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createPathway.mutateAsync({
                name: formData.name,
                description: formData.description || undefined,
                sequenceCount: parseInt(formData.sequenceCount),
            })
            setDialogOpen(false)
            setFormData({ name: '', description: '', sequenceCount: '9' })
        } catch (error) {
            console.error('Failed to create pathway:', error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{t('title')}</h1>
                    <p className="text-muted-foreground mt-2">
                        {t('subtitle')}
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            {t('addPathway')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{t('createNew')}</DialogTitle>
                                <DialogDescription>
                                    {t('createNewDesc')}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('nameRequired')}</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder={t('namePlaceholder')}
                                        minLength={2}
                                        maxLength={100}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">{t('description')}</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder={t('descPlaceholder')}
                                        rows={3}
                                        maxLength={2000}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="sequenceCount">{t('sequenceCount')}</Label>
                                    <Input
                                        id="sequenceCount"
                                        type="number"
                                        value={formData.sequenceCount}
                                        onChange={(e) => setFormData({ ...formData, sequenceCount: e.target.value })}
                                        min="1"
                                        max="9"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createPathway.isPending}>
                                    {createPathway.isPending ? t('creating') : t('createPathway')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="h-48" />
                        </Card>
                    ))}
                </div>
            ) : pathways && pathways.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pathways.map((pathway) => (
                        <PathwayCard key={pathway.id} pathway={pathway} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="text-center py-12">
                        <Compass className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">{t('noPathways')}</p>
                        <Button onClick={() => setDialogOpen(true)}>
                            {t('createFirst')}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function PathwayCard({ pathway }: { pathway: any }) {
    const { data: items } = useItemsByPathway(pathway.id)
    const t = useTranslations('pathways')

    return (
        <Card className="hover:shadow-lg transition-all">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{pathway.name}</span>
                    <Badge variant="outline">
                        {items?.length || 0} {t('items')}
                    </Badge>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                    {pathway.description || t('noDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                        {t('sequences')}: 0-{pathway.sequenceCount}
                    </div>
                    <Link href={`/items?pathway=${pathway.id}`}>
                        <Button variant="outline" className="w-full">
                            {t('viewItems')}
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}