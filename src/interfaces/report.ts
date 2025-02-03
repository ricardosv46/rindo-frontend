import { IExpense } from './expense'

export type ReportStatus = 'OBSERVED' | 'DRAFT' | 'CLOSED' | 'IN_PROCESS'

export interface IReport {
  id?: string
  _id?: string
  name?: string
  expenses?: IExpense[]
  status?: ReportStatus
  created?: string
}

export interface IExpenseRequest {
  id?: string
  _id?: string
  name?: string
  status?: ReportStatus
  expenses?: string[]
}
