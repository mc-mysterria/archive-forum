'use client'

import { useState } from 'react'
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
    const [formData, setFormData] = useState({
        name: defaultValues.name || '',
        description: defaultValues.description || '',
        purpose: defaultValues.purpose || '',
        pathwayId: defaultValues.pathwayId?.toString() || '',
        typeId: defaultValues.typeId?.toString() || '',
        sequenceNumber: defaultValues.sequenceNumber?.toString() || '',
        rarity: defaultValues.rarity || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const data = {
            name: formData.name,
            description: formData.description || undefined,
            purpose: formData.purpose || undefined,
            pathwayId: formData.pathwayId ? parseInt(formData.pathwayId) : undefined,
            typeId: formData.typeId ? parseInt(formData.typeId) : undefined,
            sequenceNumber: formData.sequenceNumber ? parseInt(formData.sequenceNumber) : undefined,
            rarity: formData.rarity || undefined,
        }
        onSubmit(data)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter item name..."
                    minLength={2}
                    maxLength={100}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the item..."
                    rows={4}
                    maxLength={2000}
                />
                <p className="text-xs text-muted-foreground">
                    {formData.description.length}/2000 characters
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="What is this item used for?"
                    rows={3}
                    maxLength={2000}
                />
                <p className="text-xs text-muted-foreground">
                    {formData.purpose.length}/2000 characters
                </p>
            </div>

            {!isEdit && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pathway">Pathway</Label>
                            <Select
                                value={formData.pathwayId}
                                onValueChange={(value) => setFormData({ ...formData, pathwayId: value })}
                            >
                                <SelectTrigger id="pathway">
                                    <SelectValue placeholder="Select pathway" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">None</SelectItem>
                                    {pathways.map((pathway) => (
                                        <SelectItem key={pathway.id} value={pathway.id.toString()}>
                                            {pathway.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.typeId}
                                onValueChange={(value) => setFormData({ ...formData, typeId: value })}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">None</SelectItem>
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
                            <Label htmlFor="sequence">Sequence Number</Label>
                            <Select
                                value={formData.sequenceNumber}
                                onValueChange={(value) => setFormData({ ...formData, sequenceNumber: value })}
                            >
                                <SelectTrigger id="sequence">
                                    <SelectValue placeholder="Select sequence" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">None</SelectItem>
                                    {SEQUENCES.map((seq) => (
                                        <SelectItem key={seq} value={seq.toString()}>
                                            Sequence {seq}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rarity">Rarity</Label>
                            <Select
                                value={formData.rarity}
                                onValueChange={(value) => setFormData({ ...formData, rarity: value })}
                            >
                                <SelectTrigger id="rarity">
                                    <SelectValue placeholder="Select rarity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">None</SelectItem>
                                    {RARITIES.map((rarity) => (
                                        <SelectItem key={rarity} value={rarity}>
                                            {rarity}
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
                    {isSubmitting ? 'Saving...' : isEdit ? 'Update Item' : 'Create Item'}
                </Button>
            </div>
        </form>
    )
}