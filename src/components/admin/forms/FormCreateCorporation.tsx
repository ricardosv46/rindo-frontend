import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Divider, TextField } from '@mui/material'
import { createCorporation } from '@services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

export interface IFormCreateCorporation {
  name: string
  email: string
  password: string
}

const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  email: yup.string().email('Correo invalido').required('El correo es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida')
})

interface FormCreateCorporationProps {
  onClose: () => void
}
export const FormCreateCorporation = ({ onClose }: FormCreateCorporationProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IFormCreateCorporation>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: IFormCreateCorporation) => {
    mutateCreate(values)
  }
  const queryClient = useQueryClient()
  const { mutate: mutateCreate, isPending } = useMutation({
    mutationFn: createCorporation,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getUsers'] })
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
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Correo"
            size="small"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="password"
            label="Contraseña"
            size="small"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />
      <Divider />
      <Button type="submit" variant="contained" disabled={isPending}>
        Crear
      </Button>
    </form>
  )
}
