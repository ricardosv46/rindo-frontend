import { Card, Modal } from '@components/shared'
import { IArea } from '@interfaces/area'
import { IUser } from '@interfaces/user'
import { Button, Divider } from '@mui/material'
import { deleteApprover } from '@services/area'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'react-toastify'

interface IModalDeleteHolding {
  isOpen: boolean
  onClose: () => void
  data?: IUser | null
  area?: string
}

export const ModalDeleteApprover = ({ isOpen, onClose, data, area }: IModalDeleteHolding) => {
  const queryClient = useQueryClient()

  const { mutate: mutateDeleteuser, isPending } = useMutation({
    mutationFn: deleteApprover,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getApprovers'] })
      onClose()
    }
  })

  const handleDelete = () => {
    mutateDeleteuser({ id: area! })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-[400px] max-h-[95vh] overflow-hidden">
        <p className="pb-6">Eliminar Usuario</p>
        <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
        <div className="flex flex-col gap-5">
          <p className="text-center">¿Estás seguro de eliminar este approbador?</p>
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
