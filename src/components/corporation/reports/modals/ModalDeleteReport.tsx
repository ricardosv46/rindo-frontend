import { Card, Modal } from '@components/shared'
import { IReport } from '@interfaces/report'
import { Button, Divider } from '@mui/material'
import { deleteExpense } from '@services/expense'
import { deleteReport } from '@services/report'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

interface IModalDeleteReport {
  isOpen: boolean
  onClose: () => void
  data?: IReport | null
}

export const ModalDeleteReport = ({ isOpen, onClose, data }: IModalDeleteReport) => {
  const queryClient = useQueryClient()

  const { mutate: mutateDelete, isPending } = useMutation({
    mutationFn: deleteReport,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getReports'] })
      onClose()
    }
  })

  const handleDelete = () => {
    mutateDelete({ id: data?._id! })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Eliminar Informe</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
        <div className="flex flex-col gap-5">
          <p className="text-center">¿Estás seguro de eliminar este informe?</p>
          <p className="text-center">{data?.name}</p>
        </div>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', my: 4 }} />
        <div className="flex justify-center w-full gap-5">
          <Button variant="contained" className="w-full" onClick={handleDelete} disabled={isPending}>
            Si
          </Button>
          <Button variant="outlined" className="w-full" onClick={onClose}>
            No
          </Button>
        </div>
      </Card>
    </Modal>
  )
}
