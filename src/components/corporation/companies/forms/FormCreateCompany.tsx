import { yupResolver } from '@hookform/resolvers/yup'
import { useToggle } from '@hooks/useToggle'
import { Button, Divider, IconButton, InputAdornment, TextField } from '@mui/material'
import { createCompany } from '@services/company'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

export interface IFormCreateCompany {
  ruc: string
  name: string
  username: string
  password: string
}

const validationSchema = yup.object().shape({
  ruc: yup
    .string()
    .matches(/^\d+$/, 'El ruc solo puede contener números ')
    .length(11, 'El ruc tener exactamente 11 dígitos')
    .required('El ruc es requerido'),
  name: yup.string().required('El nombre es requerido'),
  username: yup.string().required('El usuario es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida')
})
interface FormCreateCompanyProps {
  onClose: () => void
}
export const FormCreateCompany = ({ onClose }: FormCreateCompanyProps) => {
  const [isOpenPassword, , , togglePassword] = useToggle()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IFormCreateCompany>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ruc: '',
      name: '',
      username: '',
      password: ''
    }
  })

  const onSubmit = async (values: IFormCreateCompany) => {
    mutateCreate(values)
  }
  const queryClient = useQueryClient()
  const { mutate: mutateCreate, isPending } = useMutation({
    mutationFn: createCompany,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getCompanies'] })
      onClose()
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-h-[calc(100vh-150px)] py-2 overflow-auto">
      <Controller
        name="ruc"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Ruc"
            size="small"
            error={!!errors.ruc}
            helperText={errors.ruc?.message}
            slotProps={{
              htmlInput: { maxLength: 11 }
            }}
          />
        )}
      />
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
        name="username"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Usuario"
            size="small"
            error={!!errors.username}
            helperText={errors.username?.message}
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

      <Divider />
      <Button type="submit" variant="contained" disabled={isPending}>
        Crear
      </Button>
    </form>
  )
}
