import { Card, Modal } from '@components/shared'
import React from 'react'
import { FormCreateCompany } from '../forms/FormCreateCompany'
import { Divider } from '@components/ui/divider'
Animation
interface IModalCreateCompany {
  isOpen: boolean
  onClose: () => void
}

export const ModalCreateCompany = ({ isOpen, onClose }: IModalCreateCompany) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="">Crear Empresa</p>
        <Divider className="w-[calc(100%+48px)] -mx-6  my-4" />
        <FormCreateCompany onClose={onClose} />
      </Card>
    </Modal>
  )
}
