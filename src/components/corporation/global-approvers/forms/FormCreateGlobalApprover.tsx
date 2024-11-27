import { yupResolver } from '@hookform/resolvers/yup'
import { useToggle } from '@hooks/useToggle'
import { Button, Divider, IconButton, InputAdornment, TextField } from '@mui/material'
import { createGlobalApprover } from '@services/user'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

export interface IFormCreateGlobalApprover {
  name: string
  lastname: string
  email: string
  password: string
  document: string
  phone: string
}

const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  lastname: yup.string().required('El apellido es requerido'),
  email: yup.string().email('Correo inválido').required('El correo es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
  document: yup
    .string()
    .matches(/^\d+$/, 'El documento solo puede contener números ')
    .length(9, 'El documento debe tener 8 o 9 dígitos')
    .required('El documento es requerido'),
  phone: yup
    .string()
    .matches(/^\d+$/, 'El número de teléfono solo puede contener números')
    .length(9, 'El número de teléfono debe tener exactamente 9 dígitos')
    .required('El número de teléfono es requerido')
})
interface FormCreateGlobalApproverProps {
  onClose: () => void
}
export const FormCreateGlobalApprover = ({ onClose }: FormCreateGlobalApproverProps) => {
  const [isOpenPassword, , , togglePassword] = useToggle()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IFormCreateGlobalApprover>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      document: '',
      phone: ''
    }
  })

  const onSubmit = async (values: IFormCreateGlobalApprover) => {
    mutateCreate(values)
  }
  const queryClient = useQueryClient()
  const { mutate: mutateCreate, isPending } = useMutation({
    mutationFn: createGlobalApprover,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getGlobalApprovers'] })
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
        name="lastname"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Apellido"
            size="small"
            error={!!errors.lastname}
            helperText={errors.lastname?.message}
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
            type={isOpenPassword ? 'text' : 'password'}
            label="Contraseña"
            size="small"
            autoComplete="off"
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={togglePassword} edge="end">
                      {!isOpenPassword ? <IconEye className="text-primary-600" /> : <IconEyeOff className="text-primary-600" />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />
        )}
      />
      <Controller
        name="document"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Documento"
            size="small"
            error={!!errors.document}
            helperText={errors.document?.message}
            slotProps={{
              htmlInput: { maxLength: 9 }
            }}
          />
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Celular"
            size="small"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            slotProps={{
              htmlInput: { maxLength: 9 }
            }}
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
