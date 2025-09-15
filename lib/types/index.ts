export interface ResearcherDto {
    id: number
    nickname: string
    createdAt: string
}

export interface PathwayDto {
    id: number
    name: string
    description: string
    sequenceCount: number
    createdAt: string
}

export interface TypeDto {
    id: number
    name: string
    description: string
    iconUrl?: string
    createdAt: string
}

export interface CommentDto {
    id: number
    content: string
    createdAt: string
    researcher: ResearcherDto
}

export interface ItemDto {
    id: number
    name: string
    description?: string
    purpose?: string
    sequenceNumber?: number
    rarity?: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHICAL'
    createdAt: string
    updatedAt: string
    researcher: ResearcherDto
    pathway?: PathwayDto
    type?: TypeDto
    comments: CommentDto[]
}

export interface CreateItemRequest {
    name: string
    description?: string
    purpose?: string
    researcherId: number
    pathwayId?: number
    typeId?: number
    sequenceNumber?: number
    rarity?: string
}

export interface UpdateItemRequest {
    name?: string
    description?: string
    purpose?: string
}

export interface CreatePathwayRequest {
    name: string
    description?: string
    sequenceCount?: number
}

export interface CreateTypeRequest {
    name: string
    description?: string
    iconUrl?: string
}

export interface CreateCommentRequest {
    content: string
    itemId: number
    researcherId: number
}

export interface CreateResearcherRequest {
    nickname: string
}

export type ActionType =
    | 'CREATE_COMMENT' | 'EDIT_COMMENT' | 'DELETE_COMMENT'
    | 'CREATE_ITEM' | 'EDIT_ITEM' | 'DELETE_ITEM'
    | 'CREATE_PATHWAY' | 'EDIT_PATHWAY' | 'DELETE_PATHWAY'
    | 'CREATE_TYPE' | 'EDIT_TYPE' | 'DELETE_TYPE'
    | 'CREATE_RESEARCHER' | 'EDIT_RESEARCHER' | 'DELETE_RESEARCHER'
    | 'CREATE_ACTION' | 'EDIT_ACTION' | 'DELETE_ACTION'

export interface ActionDto {
    id: number
    actionType: ActionType
    createdAt: string
    researcher: ResearcherDto
}

export interface FilterState {
    search: string
    pathwayIds: number[]
    typeIds: number[]
    sequences: number[]
    rarities: string[]
    sortBy: 'newest' | 'oldest' | 'name' | 'rarity'
}