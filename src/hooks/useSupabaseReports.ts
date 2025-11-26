import { useState, useEffect, useCallback } from 'react'
import { supabaseService, Report, ReportVersion } from '../services/SupabaseService'

export interface UseSupabaseReportsReturn {
  reports: Report[]
  currentReport: Report | null
  reportVersions: ReportVersion[]
  loading: boolean
  error: string | null
  createReport: (title: string, content: string) => Promise<Report | null>
  updateReport: (reportId: string, updates: Partial<Report>) => Promise<Report | null>
  getReport: (reportId: string) => Promise<Report | null>
  loadReports: (limit?: number, offset?: number) => Promise<void>
  getReportVersions: (reportId: string) => Promise<void>
  autosaveReport: (reportId: string, content: string) => Promise<boolean>
  subscribeToReportChanges: (reportId: string, callback: (payload: any) => void) => (() => void) | null
}

export function useSupabaseReports(): UseSupabaseReportsReturn {
  const [reports, setReports] = useState<Report[]>([])
  const [currentReport, setCurrentReport] = useState<Report | null>(null)
  const [reportVersions, setReportVersions] = useState<ReportVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createReport = useCallback(async (title: string, content: string): Promise<Report | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const report = await supabaseService.createReport(title, content)
      if (report) {
        setCurrentReport(report)
        setReports(prev => [report, ...prev])
      }
      return report
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create report'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateReport = useCallback(async (reportId: string, updates: Partial<Report>): Promise<Report | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedReport = await supabaseService.updateReport(reportId, updates)
      if (updatedReport) {
        setCurrentReport(updatedReport)
        setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r))
      }
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update report'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getReport = useCallback(async (reportId: string): Promise<Report | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const report = await supabaseService.getReport(reportId)
      if (report) {
        setCurrentReport(report)
      }
      return report
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get report'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const loadReports = useCallback(async (limit = 50, offset = 0): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      const reportsData = await supabaseService.getReports(limit, offset)
      setReports(reportsData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reports'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const getReportVersions = useCallback(async (reportId: string): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      const versions = await supabaseService.getReportVersions(reportId)
      setReportVersions(versions)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get report versions'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const autosaveReport = useCallback(async (reportId: string, content: string): Promise<boolean> => {
    try {
      const success = await supabaseService.autosaveReport(reportId, content)
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to autosave report'
      setError(errorMessage)
      return false
    }
  }, [])

  const subscribeToReportChanges = useCallback((reportId: string, callback: (payload: any) => void): (() => void) | null => {
    return supabaseService.subscribeToReportChanges(reportId, callback)
  }, [])

  // Load initial reports on mount
  useEffect(() => {
    loadReports()
  }, [loadReports])

  return {
    reports,
    currentReport,
    reportVersions,
    loading,
    error,
    createReport,
    updateReport,
    getReport,
    loadReports,
    getReportVersions,
    autosaveReport,
    subscribeToReportChanges,
  }
}