import { Chip } from '@components/shared'
import { ExpenseStatus } from '@interfaces/expense'
import React from 'react'

interface IChipStatus {
  status: ExpenseStatus
}
export const ChipStatusExpense = ({ status }: IChipStatus) => {
  if (status === 'DRAFT') return <Chip label="Borrador" color="blue" />
  if (status === 'APPROVED') return <Chip label="Aprobado" color="green" />
  if (status === 'REJECTED') return <Chip label="Rechazado" color="red" />
  if (status === 'IN_REPORT') return <Chip label="En Informe" color="yellow" />
  if (status === 'IN_REVIEW') return <Chip label="En Revisión" color="warning" />
  return ''
}
