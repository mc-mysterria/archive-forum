import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { typesApi } from '@/lib/api/types'
import { CreateTypeRequest } from '@/lib/types'
import { useToast } from '@/components/ui/use-toast'

export function useTypes(search?: string) {
    return useQuery({
        queryKey: ['types', search],
        queryFn: () => typesApi.getAll(search),
    })
}

export function useType(id: number) {
    return useQuery({
        queryKey: ['types', id],
        queryFn: () => typesApi.getById(id),
        enabled: !!id,
    })
}

export function useCreateType() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (data: CreateTypeRequest) => typesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['types'] })
            toast({
                title: 'Success',
                description: 'Type created successfully',
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to create type',
                variant: 'destructive',
            })
        },
    })
}

export function useDeleteType() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (id: number) => typesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['types'] })
            queryClient.invalidateQueries({ queryKey: ['items'] })
            toast({
                title: 'Success',
                description: 'Type deleted successfully',
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to delete type',
                variant: 'destructive',
            })
        },
    })
}