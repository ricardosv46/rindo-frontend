import { ICompany } from './company'

export interface IUser {
  id?: string
  areas?: string[]
  document?: string
  email?: string
  lastname?: string
  name?: string
  password?: string
  phone?: string
  role?: Role
  token?: string
  verify_email?: boolean
  _id?: string
  company?: ICompany
}

export interface IUserRequest {
  id?: string
  areas?: string[]
  document?: string
  email?: string
  lastname?: string
  name?: string
  password?: string
  phone?: string
  role?: Role
  token?: string
  verify_email?: boolean
  _id?: string
  company?: string
}

export type Role = 'ADMIN' | 'CORPORATION' | 'SUBMITTER' | 'APPROVER' | 'GLOBAL_APPROVER'
