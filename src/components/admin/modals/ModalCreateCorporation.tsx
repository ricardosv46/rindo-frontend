import { Card, Modal } from '@components/shared'
import React from 'react'
import { FormCreateCorporation } from '../forms/FormCreateCorporation'
import { Divider } from '@components/ui/divider'

interface IModalCreateCorporation {
  isOpen: boolean
  onClose: () => void
}

export const ModalCreateCorporation = ({ isOpen, onClose }: IModalCreateCorporation) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Crear Corporativo</p>
        <Divider className="w-[calc(100%+48px)] -mx-6  my-4" />
        <FormCreateCorporation onClose={onClose} />
      </Card>
    </Modal>
  )
}
