import { Card, Modal } from '@components/shared'
import { FormUpdateArea } from '../forms/FormUpdateArea'
import { IArea } from '@interfaces/area'
import { Divider } from '@components/ui/divider'
Animation
interface IModalUpdateArea {
  isOpen: boolean
  onClose: () => void
  data?: IArea | null
}

export const ModalUpdateArea = ({ isOpen, onClose, data }: IModalUpdateArea) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="">Actualizar Area</p>
        <Divider className="w-[calc(100%+48px)] -mx-6  my-4" />
        <FormUpdateArea onClose={onClose} data={data} />
      </Card>
    </Modal>
  )
}
