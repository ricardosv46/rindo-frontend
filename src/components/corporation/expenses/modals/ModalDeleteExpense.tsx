import { Card, Modal } from '@components/shared'
import { Button } from '@components/ui/button'
import { Divider } from '@components/ui/divider'
import { IExpense } from '@interfaces/expense'
import { deleteExpense } from '@services/expense'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

interface IModalDeleteExpense {
  isOpen: boolean
  onClose: () => void
  data?: IExpense | null
}

export const ModalDeleteExpense = ({ isOpen, onClose, data }: IModalDeleteExpense) => {
  const queryClient = useQueryClient()

  const { mutate: mutateDelete, isPending } = useMutation({
    mutationFn: deleteExpense,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getExpenses'] })
      onClose()
    }
  })

  const handleDelete = () => {
    mutateDelete({ id: data?._id! })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Eliminar Gasto</p>
        <Divider className="w-[calc(100%+48px)] -mx-6 mb-4" />
        <div className="flex flex-col gap-5">
          <p className="text-center">¿Estás seguro de eliminar este gasto?</p>
          <p className="text-center">{data?.description}</p>
        </div>
        <Divider className="w-[calc(100%+48px)] -mx-6  my-4" />
        <div className="flex justify-center w-full gap-5">
          <Button className="w-full" onClick={handleDelete} disabled={isPending}>
            Si
          </Button>
          <Button variant="outline" color="primary" className="w-full" onClick={onClose}>
            No
          </Button>
        </div>
      </Card>
    </Modal>
  )
}
