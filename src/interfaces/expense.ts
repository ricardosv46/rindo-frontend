export type ExpenseStatus = 'IN_REPORT' | 'APPROVED' | 'DRAFT' | 'REJECTED' | 'IN_REVIEW' | ''

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
  status?: ExpenseStatus
  history?: IHistory[]
}

export interface IHistory {
  description?: string
  status?: ExpenseStatus
  date?: string
  comment?: string
  order?: number
  createdBy?: {
    name?: string
    email?: string
    lastName?: string
  }
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
  status?: ExpenseStatus
  expenses?: string[]
  comment?: string
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

export interface IOcrExpenseRequest {
  file?: File
}
