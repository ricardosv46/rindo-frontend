import { ICompany } from './company'

export interface IArea {
  id?: string
  _id?: string
  name?: string
  status?: boolean
  approvers?: {
    order?: number
    _id?: string
    approver?: string
  }[]
  company?: ICompany
}

export interface IAreaRequest {
  id?: string
  _id?: string
  name?: string
  status?: boolean
  approvers?: string
  company?: string
}
