import { Card, Modal } from '@components/shared'
import { IUser } from '@interfaces/user'
import { FormAddApprover } from '../forms/FormAddApprover'
import { IArea } from '@interfaces/area'
import { Divider } from '@components/ui/divider'
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
        <p className="">Agregar Aprobador</p>
        <Divider className="w-[calc(100%+48px)] -mx-6  my-4" />
        <FormAddApprover onClose={onClose} company={company} area={area} users={users} areas={areas} />
      </Card>
    </Modal>
  )
}
