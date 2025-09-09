import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pathwaysApi } from '@/lib/api/pathways'
import { CreatePathwayRequest } from '@/lib/types'
import { useToast } from '@/components/ui/use-toast'

export function usePathways(search?: string) {
    return useQuery({
        queryKey: ['pathways', search],
        queryFn: () => pathwaysApi.getAll(search),
    })
}

export function usePathway(id: number) {
    return useQuery({
        queryKey: ['pathways', id],
        queryFn: () => pathwaysApi.getById(id),
        enabled: !!id,
    })
}

export function useCreatePathway() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (data: CreatePathwayRequest) => pathwaysApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pathways'] })
            toast({
                title: 'Success',
                description: 'Pathway created successfully',
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to create pathway',
                variant: 'destructive',
            })
        },
    })
}