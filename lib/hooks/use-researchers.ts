import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { researchersApi } from '@/lib/api/researchers'
import { CreateResearcherRequest } from '@/lib/types'

export function useResearchers() {
    return useQuery({
        queryKey: ['researchers'],
        queryFn: () => researchersApi.getAll(),
    })
}

export function useResearcher(id: number) {
    return useQuery({
        queryKey: ['researchers', id],
        queryFn: () => researchersApi.getById(id),
        enabled: !!id,
    })
}

export function useResearcherByNickname(nickname: string) {
    return useQuery({
        queryKey: ['researchers', 'nickname', nickname],
        queryFn: () => researchersApi.getByNickname(nickname),
        enabled: !!nickname,
    })
}

export function useCreateResearcher() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateResearcherRequest) => researchersApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['researchers'] })
        },
    })
}
