import { Card, Modal } from '@components/shared'
import { Divider } from '@mui/material'
import React from 'react'
import { FormCreateCorporation } from '../forms/FormCreateCorporation'

interface IModalCreateCorporation {
  isOpen: boolean
  onClose: () => void
}

export const ModalCreateCorporation = ({ isOpen, onClose }: IModalCreateCorporation) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Crear Corporativo</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
        <FormCreateCorporation onClose={onClose} />
      </Card>
    </Modal>
  )
}
