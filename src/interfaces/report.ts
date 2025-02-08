import { IExpense } from './expense'

export type ReportStatus = 'OBSERVED' | 'DRAFT' | 'CLOSED' | 'IN_PROCESS'

export interface IReport {
  id?: string
  _id?: string
  name?: string
  expenses?: string[]
  status?: ReportStatus
  created?: string
}

export interface IReportRequest {
  id?: string
  _id?: string
  name?: string
  expenses?: string[]
}
