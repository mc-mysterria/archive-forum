import { PathwayDto, CreatePathwayRequest } from '@/lib/types'
import { fetcher } from './client'

export const pathwaysApi = {
    getAll: (search?: string) =>
        fetcher<PathwayDto[]>(`/pathways${search ? `?search=${encodeURIComponent(search)}` : ''}`),

    getById: (id: number) =>
        fetcher<PathwayDto>(`/pathways/${id}`),

    getByName: (name: string) =>
        fetcher<PathwayDto>(`/pathways/name/${encodeURIComponent(name)}`),

    create: (data: CreatePathwayRequest) =>
        fetcher<PathwayDto>('/pathways', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        fetcher<void>(`/pathways/${id}`, {
            method: 'DELETE',
        }),
}