'use client'

import { useState } from 'react'
import { useTypes, useCreateType } from '@/lib/hooks/use-types'
import { useItemsByType } from '@/lib/hooks/use-items'
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
import { Package, Plus, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function TypesPage() {
    const { data: types, isLoading } = useTypes()
    const createType = useCreateType()
    const t = useTranslations('types')
    const tCommon = useTranslations('common')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        iconUrl: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createType.mutateAsync({
                name: formData.name,
                description: formData.description || undefined,
                iconUrl: formData.iconUrl || undefined,
            })
            setDialogOpen(false)
            setFormData({ name: '', description: '', iconUrl: '' })
        } catch (error) {
            console.error('Failed to create type:', error)
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
                            {t('addType')}
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
                                    <Label htmlFor="iconUrl">{t('iconUrl')}</Label>
                                    <Input
                                        id="iconUrl"
                                        value={formData.iconUrl}
                                        onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                                        placeholder={t('iconUrlPlaceholder')}
                                        maxLength={500}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createType.isPending}>
                                    {createType.isPending ? t('creating') : t('createType')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="h-32" />
                        </Card>
                    ))}
                </div>
            ) : types && types.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {types.map((type) => (
                        <TypeCard key={type.id} type={type} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">{t('noTypes')}</p>
                        <Button onClick={() => setDialogOpen(true)}>
                            {t('createFirst')}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function TypeCard({ type }: { type: any }) {
    const { data: items } = useItemsByType(type.id)
    const t = useTranslations('types')
    const { locale } = useParams()

    return (
        <Card className="hover:shadow-lg transition-all">
            <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <Package className="h-6 w-6 text-primary" />
                    <Badge variant="outline">
                        {items?.length || 0}
                    </Badge>
                </div>
                <CardTitle className="text-lg">{type.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                    {type.description || t('noDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href={`/${locale}/items?type=${type.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                        {t('viewItems')}
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}