import { Card, Modal } from '@components/shared'
import { Divider } from '@mui/material'
import React from 'react'
import { FormCreateCompany } from '../forms/FormCreateCompany'
Animation
interface IModalCreateCompany {
  isOpen: boolean
  onClose: () => void
}

export const ModalCreateCompany = ({ isOpen, onClose }: IModalCreateCompany) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Crear Empresa</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
        <FormCreateCompany onClose={onClose} />
      </Card>
    </Modal>
  )
}
