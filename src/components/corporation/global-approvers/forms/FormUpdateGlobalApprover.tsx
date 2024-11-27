import { yupResolver } from '@hookform/resolvers/yup'
import { IUser } from '@interfaces/user'
import { Button, Divider, TextField } from '@mui/material'
import { updateUser } from '@services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

export interface IFormUpdateUser {
  name: string
  lastname: string
  email: string
  document: string
  phone: string
}

const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  lastname: yup.string().required('El apellido es requerido'),
  email: yup.string().email('Correo inválido').required('El correo es requerido'),
  document: yup
    .string()
    .matches(/^\d{8}$|^\d{9}$/, 'El documento debe tener 8 o 9 dígitos')
    .required('El documento es requerido'),
  phone: yup
    .string()
    .matches(/^\d{9}$/, 'El número de teléfono debe tener exactamente 9 dígitos')
    .required('El número de teléfono es requerido')
})
interface FormCreateGlobalApproverProps {
  onClose: () => void
  data?: IUser | null
}
export const FormUpdateGlobalApprover = ({ onClose, data }: FormCreateGlobalApproverProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IFormUpdateUser>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: data?.name,
      lastname: data?.lastname,
      email: data?.email,
      document: data?.document,
      phone: data?.phone
    }
  })

  const onSubmit = async (values: IFormUpdateUser) => {
    mutateUpdate({ id: data?._id, ...values })
  }
  const queryClient = useQueryClient()
  const { mutate: mutateUpdate, isPending } = useMutation({
    mutationFn: updateUser,
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
        Actualizar
      </Button>
    </form>
  )
}
