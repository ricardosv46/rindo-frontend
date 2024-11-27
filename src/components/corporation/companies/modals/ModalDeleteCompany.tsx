import { Card, Modal } from '@components/shared'
import { ICompany } from '@interfaces/company'
import { Button, Divider } from '@mui/material'
import { deleteCompany } from '@services/company'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

interface IModalDeleteHolding {
  isOpen: boolean
  onClose: () => void
  data?: ICompany | null
}

export const ModalDeleteCompany = ({ isOpen, onClose, data }: IModalDeleteHolding) => {
  const queryClient = useQueryClient()

  const { mutate: mutateDelete, isPending } = useMutation({
    mutationFn: deleteCompany,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getCompanies'] })
      onClose()
    }
  })

  const handleDelete = () => {
    mutateDelete({ id: data?._id! })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Eliminar Empresa</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
        <div className="flex flex-col gap-5">
          <p className="text-center">¿Estás seguro de eliminar esta empresa?</p>
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
