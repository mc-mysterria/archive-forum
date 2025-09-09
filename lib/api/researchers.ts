import { ResearcherDto, CreateResearcherRequest } from '@/lib/types'
import { fetcher } from './client'

export const researchersApi = {
    getAll: () =>
        fetcher<ResearcherDto[]>('/researchers'),

    getById: (id: number) =>
        fetcher<ResearcherDto>(`/researchers/${id}`),

    getByNickname: (nickname: string) =>
        fetcher<ResearcherDto>(`/researchers/nickname/${encodeURIComponent(nickname)}`),

    create: (data: CreateResearcherRequest) =>
        fetcher<ResearcherDto>('/researchers', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        fetcher<void>(`/researchers/${id}`, {
            method: 'DELETE',
        }),
}