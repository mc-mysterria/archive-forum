import { useQuery } from '@tanstack/react-query'
import { actionsApi } from '@/lib/api/actions'
import { ActionType } from '@/lib/types'

export function useActions() {
    return useQuery({
        queryKey: ['actions'],
        queryFn: actionsApi.getAll,
        staleTime: 60 * 1000, // 1 minute
    })
}

export function useRecentActions(limit?: number) {
    return useQuery({
        queryKey: ['actions', 'recent', limit],
        queryFn: () => actionsApi.getRecent(limit),
        staleTime: 30 * 1000, // 30 seconds for recent actions
    })
}

export function useActionsByResearcher(researcherId: number) {
    return useQuery({
        queryKey: ['actions', 'researcher', researcherId],
        queryFn: () => actionsApi.getByResearcher(researcherId),
        staleTime: 60 * 1000,
        enabled: !!researcherId,
    })
}

export function useActionsByType(actionType: ActionType) {
    return useQuery({
        queryKey: ['actions', 'type', actionType],
        queryFn: () => actionsApi.getByType(actionType),
        staleTime: 60 * 1000,
        enabled: !!actionType,
    })
}

export function useActionsByDateRange(startDate: string, endDate: string, enabled = true) {
    return useQuery({
        queryKey: ['actions', 'dateRange', startDate, endDate],
        queryFn: () => actionsApi.getByDateRange(startDate, endDate),
        staleTime: 60 * 1000,
        enabled: enabled && !!startDate && !!endDate,
    })
}

export function useAction(id: number) {
    return useQuery({
        queryKey: ['actions', id],
        queryFn: () => actionsApi.getById(id),
        staleTime: 60 * 1000,
        enabled: !!id,
    })
}