import { Chip } from '@components/shared'
import { ReportStatus } from '@interfaces/report'
import React from 'react'

interface IChipStatus {
  status: ReportStatus
}
export const ChipStatus = ({ status }: IChipStatus) => {
  if (status === 'DRAFT') return <Chip label="Borrador" color="blue" />
  if (status === 'CLOSED') return <Chip label="Aprobado" color="green" />
  if (status === 'OBSERVED') return <Chip label="Rechazado" color="red" />
  if (status === 'IN_PROCESS') return <Chip label="En Informe" color="yellow" />
  return ''
}
