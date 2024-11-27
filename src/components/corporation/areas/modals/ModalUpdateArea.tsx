import { Card, Modal } from '@components/shared'
import { Divider } from '@mui/material'
import { FormUpdateArea } from '../forms/FormUpdateArea'
import { IArea } from '@interfaces/area'
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
        <p className="pb-6">Actualizar Area</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
        <FormUpdateArea onClose={onClose} data={data} />
      </Card>
    </Modal>
  )
}
