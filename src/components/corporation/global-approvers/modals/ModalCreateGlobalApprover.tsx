import { Card, Modal } from '@components/shared'
import { Divider } from '@mui/material'
import React from 'react'
import { FormCreateGlobalApprover } from '../forms/FormCreateGlobalApprover'
Animation
interface IModalCreateGlobalApprover {
  isOpen: boolean
  onClose: () => void
}

export const ModalCreateGlobalApprover = ({ isOpen, onClose }: IModalCreateGlobalApprover) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Crear Aprobador Global</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
        <FormCreateGlobalApprover onClose={onClose} />
      </Card>
    </Modal>
  )
}
