import { Card, Modal } from '@components/shared'
import React from 'react'
import { FormUpdateUser } from '../forms/FormUpdateUser'
import { IUser } from '@interfaces/user'
import { ICompany } from '@interfaces/company'
import { IArea } from '@interfaces/area'
import { Divider } from '@components/ui/divider'
Animation
interface IModalCreateUser {
  isOpen: boolean
  onClose: () => void
  data?: IUser | null
  companies: ICompany[]
  areas: IArea[]
}

export const ModalUpdateUser = ({ isOpen, onClose, data, companies, areas }: IModalCreateUser) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="">Actualizar Usuario</p>
        <Divider className="w-[calc(100%+48px)] -mx-6  my-4" />
        <FormUpdateUser onClose={onClose} data={data} companies={companies} areas={areas} />
      </Card>
    </Modal>
  )
}
