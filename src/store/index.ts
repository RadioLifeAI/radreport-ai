import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ReportState {
  content: string
  modalidade: string
  currentReport: any | null
  currentReportId?: string
  versions: any[]
  setContent: (content: string) => void
  setModalidade: (modalidade: string) => void
  setCurrentReport: (report: any) => void
  setCurrentReportId: (id: string | undefined) => void
  updateContent: (content: string) => void
  addVersion: (version: any) => void
}

export const useReportStore = create<ReportState>()(
  persist(
    (set) => ({
      content: '',
      modalidade: '',
      currentReport: null,
      currentReportId: undefined,
      versions: [],
      setContent: (content) => set({ content }),
      setModalidade: (modalidade) => set({ modalidade }),
      setCurrentReport: (report) => set({ currentReport: report, currentReportId: report?.id }),
      setCurrentReportId: (currentReportId) => set({ currentReportId }),
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
