import { ItemDto, CreateItemRequest, UpdateItemRequest } from '@/lib/types'
import { fetcher } from './client'

export const itemsApi = {
    getAll: (search?: string) =>
        fetcher<ItemDto[]>(`/items${search ? `?search=${encodeURIComponent(search)}` : ''}`),

    getById: (id: number) =>
        fetcher<ItemDto>(`/items/${id}`),

    create: (data: CreateItemRequest) =>
        fetcher<ItemDto>('/items', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: number, data: UpdateItemRequest) =>
        fetcher<ItemDto>(`/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        fetcher<void>(`/items/${id}`, {
            method: 'DELETE',
        }),

    getByResearcher: (researcherId: number) =>
        fetcher<ItemDto[]>(`/items/researcher/${researcherId}`),

    getByPathway: (pathwayId: number) =>
        fetcher<ItemDto[]>(`/items/pathway/${pathwayId}`),

    getByType: (typeId: number) =>
        fetcher<ItemDto[]>(`/items/type/${typeId}`),

    getBySequence: (sequenceNumber: number) =>
        fetcher<ItemDto[]>(`/items/sequence/${sequenceNumber}`),

    getByRarity: (rarity: string) =>
        fetcher<ItemDto[]>(`/items/rarity/${rarity}`),
}