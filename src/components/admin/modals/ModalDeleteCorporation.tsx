import { Card, Modal } from '@components/shared'
import { IUser } from '@interfaces/user'
import { Button, Divider } from '@mui/material'
import { deleteUser } from '@services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'react-toastify'

interface IModalDeleteHolding {
  isOpen: boolean
  onClose: () => void
  data?: IUser | null
}

export const ModalDeleteCorporation = ({ isOpen, onClose, data }: IModalDeleteHolding) => {
  const queryClient = useQueryClient()

  const { mutate: mutateDeleteuser, isPending } = useMutation({
    mutationFn: deleteUser,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getUsers'] })
      onClose()
    }
  })

  const handleDelete = () => {
    mutateDeleteuser({ id: data?._id! })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Eliminar Corporativo</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
        <div className="flex flex-col gap-5">
          <p className="text-center">¿Estás seguro de eliminar este corporativo?</p>
          <p className="text-center">
            {data?.name} {data?.lastname}
          </p>
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
