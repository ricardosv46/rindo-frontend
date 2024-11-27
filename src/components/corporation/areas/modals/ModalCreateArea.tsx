import { Card, Modal } from '@components/shared'
import { Divider } from '@mui/material'
import React from 'react'
import { FormCreateArea } from '../forms/FormCreateArea'
import { ICompany } from '@interfaces/company'
Animation
interface IModalCreateArea {
  isOpen: boolean
  onClose: () => void
  companies: ICompany[]
}

export const ModalCreateArea = ({ isOpen, onClose, companies }: IModalCreateArea) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Crear Area</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
        <FormCreateArea onClose={onClose} companies={companies} />
      </Card>
    </Modal>
  )
}
