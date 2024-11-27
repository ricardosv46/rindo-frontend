import { Card, Modal } from '@components/shared'
import { Divider } from '@mui/material'
import React from 'react'
import { FormCreateUser } from '../forms/FormCreateUser'
import { ICompany } from '@interfaces/company'
import { IArea } from '@interfaces/area'
import { ScrollArea } from '@components/ui/scroll-area'
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
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Crear Usuario</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 2 }} />

        <FormCreateUser onClose={onClose} companies={companies} areas={areas} />
      </Card>
    </Modal>
  )
}
