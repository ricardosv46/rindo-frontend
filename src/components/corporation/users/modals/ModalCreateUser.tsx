import { Card, Modal } from '@components/shared'
import React from 'react'
import { FormCreateUser } from '../forms/FormCreateUser'
import { ICompany } from '@interfaces/company'
import { IArea } from '@interfaces/area'
import { Divider } from '@components/ui/divider'
Animation
interface IModalCreateUser {
  isOpen: boolean
  onClose: () => void
  companies: ICompany[]
  areas: IArea[]
}

export const ModalCreateUser = ({ isOpen, onClose, companies, areas }: IModalCreateUser) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden ">
        <p className="">Crear Usuario</p>
        <Divider className="w-[calc(100%+48px)] -mx-6  my-4" />
        <FormCreateUser onClose={onClose} companies={companies} areas={areas} />
      </Card>
    </Modal>
  )
}
