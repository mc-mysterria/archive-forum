import { CommentDto, CreateCommentRequest } from '@/lib/types'
import { fetcher } from './client'

export const commentsApi = {
    getById: (id: number) =>
        fetcher<CommentDto>(`/comments/${id}`),

    getByItem: (itemId: number) =>
        fetcher<CommentDto[]>(`/comments/item/${itemId}`),

    getByResearcher: (researcherId: number) =>
        fetcher<CommentDto[]>(`/comments/researcher/${researcherId}`),

    create: (data: CreateCommentRequest) =>
        fetcher<CommentDto>('/comments', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        fetcher<void>(`/comments/${id}`, {
            method: 'DELETE',
        }),
}