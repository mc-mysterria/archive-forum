import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { itemsApi } from '@/lib/api/items'
import { CreateItemRequest, UpdateItemRequest } from '@/lib/types'
import { useToast } from '@/components/ui/use-toast'

export function useItems(search?: string) {
    return useQuery({
        queryKey: ['items', search],
        queryFn: () => itemsApi.getAll(search),
    })
}

export function useItem(id: number) {
    return useQuery({
        queryKey: ['items', id],
        queryFn: () => itemsApi.getById(id),
        enabled: !!id,
    })
}

export function useItemsByResearcher(researcherId: number) {
    return useQuery({
        queryKey: ['items', 'researcher', researcherId],
        queryFn: () => itemsApi.getByResearcher(researcherId),
        enabled: !!researcherId,
    })
}

export function useItemsByPathway(pathwayId: number) {
    return useQuery({
        queryKey: ['items', 'pathway', pathwayId],
        queryFn: () => itemsApi.getByPathway(pathwayId),
        enabled: !!pathwayId,
    })
}

export function useItemsByType(typeId: number) {
    return useQuery({
        queryKey: ['items', 'type', typeId],
        queryFn: () => itemsApi.getByType(typeId),
        enabled: !!typeId,
    })
}

export function useCreateItem() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (data: CreateItemRequest) => itemsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] })
            toast({
                title: 'Success',
                description: 'Item created successfully',
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to create item',
                variant: 'destructive',
            })
        },
    })
}

export function useUpdateItem() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateItemRequest }) =>
            itemsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['items'] })
            queryClient.invalidateQueries({ queryKey: ['items', id] })
            toast({
                title: 'Success',
                description: 'Item updated successfully',
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to update item',
                variant: 'destructive',
            })
        },
    })
}

export function useDeleteItem() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (id: number) => itemsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] })
            toast({
                title: 'Success',
                description: 'Item deleted successfully',
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to delete item',
                variant: 'destructive',
            })
        },
    })
}