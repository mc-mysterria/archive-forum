'use client'

import { Suspense, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useItems } from '@/lib/hooks/use-items'
import { usePathways } from '@/lib/hooks/use-pathways'
import { useTypes } from '@/lib/hooks/use-types'
import { ItemCard } from '@/components/items/item-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Filter, X } from 'lucide-react'
import Link from 'next/link'

const RARITIES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHICAL']
const SEQUENCES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function ItemsPageContent() {
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get('search') || ''

    const [search, setSearch] = useState(initialSearch)
    const [selectedPathways, setSelectedPathways] = useState<number[]>([])
    const [selectedTypes, setSelectedTypes] = useState<number[]>([])
    const [selectedRarities, setSelectedRarities] = useState<string[]>([])
    const [selectedSequences, setSelectedSequences] = useState<number[]>([])
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'rarity'>('newest')
    const [showFilters, setShowFilters] = useState(false)

    const { data: items, isLoading } = useItems(search)
    const { data: pathways } = usePathways()
    const { data: types } = useTypes()

    const filteredAndSortedItems = useMemo(() => {
        if (!items) return []

        let filtered = [...items]

        if (selectedPathways.length > 0) {
            filtered = filtered.filter(item =>
                item.pathway && selectedPathways.includes(item.pathway.id)
            )
        }

        if (selectedTypes.length > 0) {
            filtered = filtered.filter(item =>
                item.type && selectedTypes.includes(item.type.id)
            )
        }

        if (selectedRarities.length > 0) {
            filtered = filtered.filter(item =>
                item.rarity && selectedRarities.includes(item.rarity)
            )
        }

        if (selectedSequences.length > 0) {
            filtered = filtered.filter(item =>
                item.sequenceNumber !== undefined && selectedSequences.includes(item.sequenceNumber)
            )
        }

        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                break
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'rarity':
                const rarityOrder = { MYTHICAL: 0, LEGENDARY: 1, EPIC: 2, RARE: 3, UNCOMMON: 4, COMMON: 5 }
                filtered.sort((a, b) => {
                    const aOrder = a.rarity ? rarityOrder[a.rarity as keyof typeof rarityOrder] : 6
                    const bOrder = b.rarity ? rarityOrder[b.rarity as keyof typeof rarityOrder] : 6
                    return aOrder - bOrder
                })
                break
        }

        return filtered
    }, [items, selectedPathways, selectedTypes, selectedRarities, selectedSequences, sortBy])

    const resetFilters = () => {
        setSelectedPathways([])
        setSelectedTypes([])
        setSelectedRarities([])
        setSelectedSequences([])
        setSortBy('newest')
    }

    const hasActiveFilters =
        selectedPathways.length > 0 ||
        selectedTypes.length > 0 ||
        selectedRarities.length > 0 ||
        selectedSequences.length > 0

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Mysterious Items</h1>
                <Link href="/items/new">
                    <Button>Add New Item</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Filters</CardTitle>
                                {hasActiveFilters && (
                                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                                        <X className="h-4 w-4 mr-1" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search items..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Sort By</Label>
                                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="name">Name (A-Z)</SelectItem>
                                        <SelectItem value="rarity">Rarity (High to Low)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {pathways && pathways.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Pathways</Label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {pathways.map((pathway) => (
                                            <div key={pathway.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`pathway-${pathway.id}`}
                                                    checked={selectedPathways.includes(pathway.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedPathways([...selectedPathways, pathway.id])
                                                        } else {
                                                            setSelectedPathways(selectedPathways.filter(id => id !== pathway.id))
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`pathway-${pathway.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {pathway.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {types && types.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Types</Label>
                                    <div className="space-y-2">
                                        {types.map((type) => (
                                            <div key={type.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`type-${type.id}`}
                                                    checked={selectedTypes.includes(type.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedTypes([...selectedTypes, type.id])
                                                        } else {
                                                            setSelectedTypes(selectedTypes.filter(id => id !== type.id))
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`type-${type.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {type.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Rarity</Label>
                                <div className="space-y-2">
                                    {RARITIES.map((rarity) => (
                                        <div key={rarity} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`rarity-${rarity}`}
                                                checked={selectedRarities.includes(rarity)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedRarities([...selectedRarities, rarity])
                                                    } else {
                                                        setSelectedRarities(selectedRarities.filter(r => r !== rarity))
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor={`rarity-${rarity}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {rarity}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Sequence</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SEQUENCES.map((seq) => (
                                        <div key={seq} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`seq-${seq}`}
                                                checked={selectedSequences.includes(seq)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedSequences([...selectedSequences, seq])
                                                    } else {
                                                        setSelectedSequences(selectedSequences.filter(s => s !== seq))
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor={`seq-${seq}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {seq}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-4 lg:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </Button>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-muted-foreground">
                            {filteredAndSortedItems.length} items found
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="h-48" />
                                </Card>
                            ))}
                        </div>
                    ) : filteredAndSortedItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredAndSortedItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-muted-foreground">No items found matching your criteria.</p>
                                {hasActiveFilters && (
                                    <Button variant="outline" className="mt-4" onClick={resetFilters}>
                                        Clear Filters
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function ItemsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="animate-pulse h-6 w-40 bg-muted rounded mb-4" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => (<Card key={i} className="animate-pulse"><CardContent className="h-48" /></Card>))}</div></div>}>
            <ItemsPageContent />
        </Suspense>
    )
}