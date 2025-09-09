import { create } from 'zustand'
import { FilterState } from '@/lib/types'

interface FilterStore extends FilterState {
    setSearch: (search: string) => void
    setPathwayIds: (ids: number[]) => void
    setTypeIds: (ids: number[]) => void
    setSequences: (sequences: number[]) => void
    setRarities: (rarities: string[]) => void
    setSortBy: (sortBy: FilterState['sortBy']) => void
    resetFilters: () => void
}

const initialState: FilterState = {
    search: '',
    pathwayIds: [],
    typeIds: [],
    sequences: [],
    rarities: [],
    sortBy: 'newest',
}

export const useFilterStore = create<FilterStore>((set) => ({
    ...initialState,
    setSearch: (search) => set({ search }),
    setPathwayIds: (pathwayIds) => set({ pathwayIds }),
    setTypeIds: (typeIds) => set({ typeIds }),
    setSequences: (sequences) => set({ sequences }),
    setRarities: (rarities) => set({ rarities }),
    setSortBy: (sortBy) => set({ sortBy }),
    resetFilters: () => set(initialState),
}))