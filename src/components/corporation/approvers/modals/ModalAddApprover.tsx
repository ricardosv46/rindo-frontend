import { Card, Modal } from '@components/shared'
import { IUser } from '@interfaces/user'
import { Divider } from '@mui/material'
import { FormAddApprover } from '../forms/FormAddApprover'
import { IArea } from '@interfaces/area'
Animation
interface IModalAddApprover {
  isOpen: boolean
  onClose: () => void
  company: string
  area: string
  users: IUser[]
  areas: IArea[]
}

export const ModalAddApprover = ({ isOpen, onClose, company, area, users, areas }: IModalAddApprover) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Agregar Aprobador</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 2 }} />

        <FormAddApprover onClose={onClose} company={company} area={area} users={users} areas={areas} />
      </Card>
    </Modal>
  )
}
