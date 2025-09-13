'use client'

import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCreateItem } from '@/lib/hooks/use-items'
import { usePathways } from '@/lib/hooks/use-pathways'
import { useTypes } from '@/lib/hooks/use-types'
import { useResearcherStore } from '@/lib/store/researcher-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ItemForm } from '@/components/items/item-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewItemPage() {
    const params = useParams()
    const router = useRouter()
    const t = useTranslations('items')
    const locale = params.locale as string
    const createItem = useCreateItem()
    const { data: pathways } = usePathways()
    const { data: types } = useTypes()
    const { researcher } = useResearcherStore()
    const { user } = useAuth()

    const handleSubmit = async (data: any) => {
        if (!user) return

        try {
            const newItem = await createItem.mutateAsync({
                ...data,
                researcherId: researcher?.id || parseInt(user.id.toString()), // Ensure it's a number
            })
            router.push(`/${locale}/items/${newItem.id}`)
        } catch (error) {
            console.error('Failed to create item:', error)
        }
    }

    return (
        <ProtectedRoute requiredPermission="PERM_ARCHIVE:WRITE">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="mb-6">
                    <Link href={`/${locale}/items`}>
                        <Button variant="ghost" size="sm">
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            {t('backToItems')}
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('createNew')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ItemForm
                            pathways={pathways || []}
                            types={types || []}
                            onSubmit={handleSubmit}
                            isSubmitting={createItem.isPending}
                        />
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    )
}
