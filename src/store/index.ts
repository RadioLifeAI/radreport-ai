import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ReportState {
  content: string
  modalidade: string
  currentReport: any | null
  versions: any[]
  setContent: (content: string) => void
  setModalidade: (modalidade: string) => void
  setCurrentReport: (report: any) => void
  updateContent: (content: string) => void
  addVersion: (version: any) => void
}

export const useReportStore = create<ReportState>()(
  persist(
    (set) => ({
      content: '',
      modalidade: '',
      currentReport: null,
      versions: [],
      setContent: (content) => set({ content }),
      setModalidade: (modalidade) => set({ modalidade }),
      setCurrentReport: (report) => set({ currentReport: report }),
      updateContent: (content) => set({ content }),
      addVersion: (version) => set((state) => ({ 
        versions: [...state.versions, version] 
      })),
    }),
    {
      name: 'radreport-storage',
    }
  )
)
