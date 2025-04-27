import { Card, Modal } from '@components/shared'
import React from 'react'
import { FormCreateArea } from '../forms/FormCreateArea'
import { ICompany } from '@interfaces/company'
import { Divider } from '@components/ui/divider'
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
        <p className="">Crear Area</p>
        <Divider className="w-[calc(100%+48px)] -mx-6  my-4" />
        <FormCreateArea onClose={onClose} companies={companies} />
      </Card>
    </Modal>
  )
}
