import { Card, Modal } from '@components/shared'
import { Button } from '@components/ui/button'
import { Divider } from '@components/ui/divider'
import { IUser } from '@interfaces/user'
import { deleteApprover } from '@services/area'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

interface IModalDeleteHolding {
  isOpen: boolean
  onClose: () => void
  data?: IUser | null
  area?: string
}

export const ModalDeleteApprover = ({ isOpen, onClose, data, area }: IModalDeleteHolding) => {
  const queryClient = useQueryClient()

  const { mutate: mutateDeleteApprover, isPending } = useMutation({
    mutationFn: deleteApprover,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getApprovers'] })
      queryClient.invalidateQueries({ queryKey: ['getAreas'] })
      onClose()
    }
  })

  const handleDelete = () => {
    mutateDeleteApprover({ id: area!, approver: data?._id! })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="">Eliminar Usuario</p>
        <Divider className="w-[calc(100%+48px)] -mx-6  my-4" />
        <div className="flex flex-col gap-5">
          <p className="text-center">¿Estás seguro de eliminar este approbador?</p>
          <p className="text-center">{data?.name}</p>
        </div>
        <Divider className="my-4" />
        <div className="flex justify-center w-full gap-5">
          <Button className="w-full" onClick={handleDelete} disabled={isPending}>
            Si
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            No
          </Button>
        </div>
      </Card>
    </Modal>
  )
}
