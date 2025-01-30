import { Card, Modal } from '@components/shared'
import { IExpense } from '@interfaces/expense'
import { IUser } from '@interfaces/user'
import { Button, Divider } from '@mui/material'
import { deleteExpense } from '@services/expense'
import { deleteUser } from '@services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
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
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
        <div className="flex flex-col gap-5">
          <p className="text-center">¿Estás seguro de eliminar este gasto?</p>
          <p className="text-center">{data?.description}</p>
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
