import { TypeDto, CreateTypeRequest } from '@/lib/types'
import { fetcher } from './client'

export const typesApi = {
    getAll: (search?: string) =>
        fetcher<TypeDto[]>(`/types${search ? `?search=${encodeURIComponent(search)}` : ''}`),

    getById: (id: number) =>
        fetcher<TypeDto>(`/types/${id}`),

    getByName: (name: string) =>
        fetcher<TypeDto>(`/types/name/${encodeURIComponent(name)}`),

    create: (data: CreateTypeRequest) =>
        fetcher<TypeDto>('/types', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        fetcher<void>(`/types/${id}`, {
            method: 'DELETE',
        }),
}