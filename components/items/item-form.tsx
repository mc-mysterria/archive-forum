'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PathwayDto, TypeDto } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface ItemFormProps {
    pathways: PathwayDto[]
    types: TypeDto[]
    onSubmit: (data: any) => void
    isSubmitting?: boolean
    defaultValues?: {
        name?: string
        description?: string
        purpose?: string
        pathwayId?: number
        typeId?: number
        sequenceNumber?: number
        rarity?: string
    }
    isEdit?: boolean
}

const RARITIES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHICAL']
const SEQUENCES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export function ItemForm({
                             pathways,
                             types,
                             onSubmit,
                             isSubmitting,
                             defaultValues = {},
                             isEdit = false,
                         }: ItemFormProps) {
    const t = useTranslations('form')
    const tRarity = useTranslations('rarity')
    const [formData, setFormData] = useState({
        name: defaultValues.name || '',
        description: defaultValues.description || '',
        purpose: defaultValues.purpose || '',
        pathwayId: defaultValues.pathwayId?.toString() || 'none',
        typeId: defaultValues.typeId?.toString() || 'none',
        sequenceNumber: defaultValues.sequenceNumber?.toString() || 'none',
        rarity: defaultValues.rarity || 'none',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const data = {
            name: formData.name,
            description: formData.description || undefined,
            purpose: formData.purpose || undefined,
            pathwayId: formData.pathwayId !== 'none' ? parseInt(formData.pathwayId) : undefined,
            typeId: formData.typeId !== 'none' ? parseInt(formData.typeId) : undefined,
            sequenceNumber: formData.sequenceNumber !== 'none' ? parseInt(formData.sequenceNumber) : undefined,
            rarity: formData.rarity !== 'none' ? formData.rarity : undefined,
        }
        onSubmit(data)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">{t('nameLabel')}</Label>
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

            <div className="space-y-2">
                <Label htmlFor="description">{t('descriptionLabel')}</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('descPlaceholder')}
                    rows={4}
                    maxLength={2000}
                />
                <p className="text-xs text-muted-foreground">
                    {formData.description.length}/2000 {t('charactersCount')}
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="purpose">{t('purposeLabel')}</Label>
                <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder={t('purposePlaceholder')}
                    rows={3}
                    maxLength={2000}
                />
                <p className="text-xs text-muted-foreground">
                    {formData.purpose.length}/2000 {t('charactersCount')}
                </p>
            </div>

            {!isEdit && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pathway">{t('pathwayLabel')}</Label>
                            <Select
                                value={formData.pathwayId}
                                onValueChange={(value) => setFormData({ ...formData, pathwayId: value })}
                            >
                                <SelectTrigger id="pathway">
                                    <SelectValue placeholder={t('selectPathway')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('none')}</SelectItem>
                                    {pathways.map((pathway) => (
                                        <SelectItem key={pathway.id} value={pathway.id.toString()}>
                                            {pathway.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">{t('typeLabel')}</Label>
                            <Select
                                value={formData.typeId}
                                onValueChange={(value) => setFormData({ ...formData, typeId: value })}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder={t('selectType')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('none')}</SelectItem>
                                    {types.map((type) => (
                                        <SelectItem key={type.id} value={type.id.toString()}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="sequence">{t('sequenceLabel')}</Label>
                            <Select
                                value={formData.sequenceNumber}
                                onValueChange={(value) => setFormData({ ...formData, sequenceNumber: value })}
                            >
                                <SelectTrigger id="sequence">
                                    <SelectValue placeholder={t('selectSequence')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('none')}</SelectItem>
                                    {SEQUENCES.map((seq) => (
                                        <SelectItem key={seq} value={seq.toString()}>
                                            {t('sequence')} {seq}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rarity">{t('rarityLabel')}</Label>
                            <Select
                                value={formData.rarity}
                                onValueChange={(value) => setFormData({ ...formData, rarity: value })}
                            >
                                <SelectTrigger id="rarity">
                                    <SelectValue placeholder={t('selectRarity')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('none')}</SelectItem>
                                    {RARITIES.map((rarity) => (
                                        <SelectItem key={rarity} value={rarity}>
                                            {tRarity(rarity.toLowerCase())}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </>
            )}

            <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t('saving') : isEdit ? t('updateItem') : t('createItem')}
                </Button>
            </div>
        </form>
    )
}