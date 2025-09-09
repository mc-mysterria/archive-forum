'use client'

import { useItems } from '@/lib/hooks/use-items'
import { useResearchers } from '@/lib/hooks/use-researchers'
import { usePathways } from '@/lib/hooks/use-pathways'
import { ItemCard } from '@/components/items/item-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, BookOpen, Users, Compass } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function HomePage() {
    const { data: items, isLoading: itemsLoading } = useItems()
    const { data: researchers } = useResearchers()
    const { data: pathways } = usePathways()
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    const recentItems = items?.slice(0, 6) || []

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/items?search=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Mysterria Archive
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Discover and catalog the mysteries of the Lord of The Mysteries world
                </p>

                <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search for items, pathways, or mysteries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit">Search</Button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{items?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Mysterious artifacts cataloged
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Researchers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{researchers?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Active investigators
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pathways</CardTitle>
                        <Compass className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pathways?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Beyonder sequences discovered
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Recent Discoveries</h2>
                    <Link href="/items">
                        <Button variant="outline">View All Items</Button>
                    </Link>
                </div>

                {itemsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="h-48" />
                            </Card>
                        ))}
                    </div>
                ) : recentItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentItems.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-muted-foreground">No items discovered yet.</p>
                            <Link href="/items/new">
                                <Button className="mt-4">Create First Item</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Explore Pathways</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Discover the 22 Pathways of the Beyonder world
                        </p>
                        <Link href="/pathways">
                            <Button variant="secondary" className="w-full">Browse Pathways</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Item Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Browse ingredients, artifacts, mobs, and structures
                        </p>
                        <Link href="/types">
                            <Button variant="secondary" className="w-full">View Types</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Join Research</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Contribute your discoveries to the archive
                        </p>
                        <Link href="/items/new">
                            <Button className="w-full">Add New Item</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}