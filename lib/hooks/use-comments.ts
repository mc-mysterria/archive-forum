import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsApi } from '@/lib/api/comments'
import { CreateCommentRequest } from '@/lib/types'
import { useToast } from '@/components/ui/use-toast'

export function useCommentsByItem(itemId: number) {
    return useQuery({
        queryKey: ['comments', 'item', itemId],
        queryFn: () => commentsApi.getByItem(itemId),
        enabled: !!itemId,
    })
}

export function useCommentsByResearcher(researcherId: number) {
    return useQuery({
        queryKey: ['comments', 'researcher', researcherId],
        queryFn: () => commentsApi.getByResearcher(researcherId),
        enabled: !!researcherId,
    })
}

export function useCreateComment() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (data: CreateCommentRequest) => commentsApi.create(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', 'item', variables.itemId] })
            queryClient.invalidateQueries({ queryKey: ['items', variables.itemId] })
            toast({
                title: 'Success',
                description: 'Comment added successfully',
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to add comment',
                variant: 'destructive',
            })
        },
    })
}

export function useDeleteComment() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: (id: number) => commentsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] })
            queryClient.invalidateQueries({ queryKey: ['items'] })
            toast({
                title: 'Success',
                description: 'Comment deleted successfully',
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to delete comment',
                variant: 'destructive',
            })
        },
    })
}