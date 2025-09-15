import { fetcher } from './client'
import { ActionDto, ActionType } from '@/lib/types'

export const actionsApi = {
    // Get all actions
    getAll: async (): Promise<ActionDto[]> => {
        return fetcher('/actions')
    },

    // Get recent actions with optional limit
    getRecent: async (limit?: number): Promise<ActionDto[]> => {
        const params = limit ? `?limit=${limit}` : ''
        return fetcher(`/actions/recent${params}`)
    },

    // Get actions by researcher
    getByResearcher: async (researcherId: number): Promise<ActionDto[]> => {
        return fetcher(`/actions/researcher/${researcherId}`)
    },

    // Get actions by type
    getByType: async (actionType: ActionType): Promise<ActionDto[]> => {
        return fetcher(`/actions/type/${actionType}`)
    },

    // Get actions by date range
    getByDateRange: async (startDate: string, endDate: string): Promise<ActionDto[]> => {
        return fetcher(`/actions/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`)
    },

    // Get action by ID
    getById: async (id: number): Promise<ActionDto> => {
        return fetcher(`/actions/${id}`)
    }
}