'use client'

import { useParams, useRouter } from 'next/navigation'
import { useItem, useUpdateItem } from '@/lib/hooks/use-items'
import { usePathways } from '@/lib/hooks/use-pathways'
import { useTypes } from '@/lib/hooks/use-types'
import { useAuth } from '@/lib/hooks/use-auth'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ItemForm } from '@/components/items/item-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditItemPage() {
    const params = useParams()
    const router = useRouter()
    const itemId = parseInt(params.id as string)

    const { data: item, isLoading } = useItem(itemId)
    const updateItem = useUpdateItem()
    const { data: pathways } = usePathways()
    const { data: types } = useTypes()
    const { user, canModerate } = useAuth()

    const handleSubmit = async (data: any) => {
        try {
            await updateItem.mutateAsync({
                id: itemId,
                data: {
                    name: data.name,
                    description: data.description,
                    purpose: data.purpose,
                },
            })
            router.push(`/items/${itemId}`)
        } catch (error) {
            console.error('Failed to update item:', error)
        }
    }

    const canEditItem = () => {
        if (!user || !item) return false
        // User can edit if they created the item or have moderate permissions
        return user.id.toString() === item.researcher.id.toString() || canModerate()
    }

    return (
        <ProtectedRoute requiredPermission="PERM_ARCHIVE:WRITE">
            {isLoading ? (
                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <Card className="animate-pulse">
                        <CardContent className="h-96" />
                    </Card>
                </div>
            ) : !item ? (
                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-muted-foreground">Item not found</p>
                            <Link href="/items">
                                <Button>Back to Items</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            ) : !canEditItem() ? (
                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                You can only edit items you created or have moderation permissions
                            </p>
                            <Link href={`/items/${itemId}`}>
                                <Button>Back to Item</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    <div className="mb-6">
                        <Link href={`/items/${itemId}`}>
                            <Button variant="ghost" size="sm">
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Back to Item
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Item</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ItemForm
                                pathways={pathways || []}
                                types={types || []}
                                onSubmit={handleSubmit}
                                isSubmitting={updateItem.isPending}
                                defaultValues={{
                                    name: item.name,
                                    description: item.description,
                                    purpose: item.purpose,
                                    pathwayId: item.pathway?.id,
                                    typeId: item.type?.id,
                                    sequenceNumber: item.sequenceNumber,
                                    rarity: item.rarity,
                                }}
                                isEdit
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
        </ProtectedRoute>
    )
}