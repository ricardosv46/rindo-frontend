import { Card, Modal } from '@components/shared'
import { Divider } from '@mui/material'
import React from 'react'
import { FormUpdateGlobalApprover } from '../forms/FormUpdateGlobalApprover'
import { IUser } from '@interfaces/user'
Animation
interface IModalCreateGlobalApprover {
  isOpen: boolean
  onClose: () => void
  data?: IUser | null
}

export const ModalUpdateGlobalApprover = ({ isOpen, onClose, data }: IModalCreateGlobalApprover) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Actualizar Aprobador Global</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
        <FormUpdateGlobalApprover onClose={onClose} data={data} />
      </Card>
    </Modal>
  )
}
