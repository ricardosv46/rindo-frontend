import { yupResolver } from '@hookform/resolvers/yup'
import { IArea } from '@interfaces/area'
import { Button, Divider, TextField } from '@mui/material'
import { updateArea } from '@services/area'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

export interface IFormUpdateArea {
  name: string
}

const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido')
})
interface FormUpdateAreaProps {
  onClose: () => void
  data?: IArea | null
}
export const FormUpdateArea = ({ onClose, data }: FormUpdateAreaProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IFormUpdateArea>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: data?.name
    }
  })

  const onSubmit = async (values: IFormUpdateArea) => {
    mutateUpdate({ ...values, id: data?._id })
  }
  const queryClient = useQueryClient()
  const { mutate: mutateUpdate, isPending } = useMutation({
    mutationFn: updateArea,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getAreas'] })
      onClose()
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-h-[calc(100vh-150px)] py-2 overflow-auto">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Nombre"
            size="small"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

      <Divider />
      <Button type="submit" variant="contained" disabled={isPending}>
        Actualizar
      </Button>
    </form>
  )
}
