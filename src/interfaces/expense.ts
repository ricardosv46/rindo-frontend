import { ICompany } from './company'
import { typeDocuments } from '../constants/typeDocuments'

export interface IExpense {
  id?: string
  _id?: string

  ruc?: string
  companyName?: string
  description?: string
  file?: string
  fileVisa?: string
  fileRxh?: string
  category?: string
  total?: string
  currency?: string
  serie?: string
  date?: string
  typeDocument?: string
}

export interface IExpenseRequest {
  id?: string
  _id?: string

  ruc?: string
  companyName?: string
  description?: string
  file?: File
  fileVisa?: File
  fileRxh?: File
  category?: string
  total?: string
  currency?: string
  serie?: string
  date?: string
  typeDocument?: string
}

export type Category =
  | 'Alimentación'
  | 'Alojamiento'
  | 'Combustible'
  | 'Estacionamiento'
  | 'Legales'
  | 'Materiales'
  | 'Peajes'
  | 'Telefonía'
  | 'Transporte'
  | 'Viáticos'
  | 'Cuenta no deducible'
  | 'Otra'
  | ''

export type Currency = 'USD' | 'PEN' | ''

export type TypeDocument = 'FACTURA ELECTRONICA' | 'BOLETA DE VENTA' | 'TICKET' | 'RECIBO POR HONORARIOS ELECTRONICO' | ''