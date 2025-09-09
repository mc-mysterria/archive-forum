// lib/store/researcher-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ResearcherDto } from '@/lib/types'

interface ResearcherStore {
    researcher: ResearcherDto | null
    setResearcher: (researcher: ResearcherDto | null) => void
    clearResearcher: () => void
}

export const useResearcherStore = create<ResearcherStore>()(
    persist(
        (set) => ({
            researcher: null,
            setResearcher: (researcher) => set({ researcher }),
            clearResearcher: () => set({ researcher: null }),
        }),
        {
            name: 'researcher-storage',
        }
    )
)