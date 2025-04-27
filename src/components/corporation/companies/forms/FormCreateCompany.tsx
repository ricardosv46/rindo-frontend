import { FormInput } from '@components/shared'
import { Button } from '@components/ui/button'
import { Divider } from '@components/ui/divider'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToggle } from '@hooks/useToggle'
import { onlyNumbers } from '@lib/utils'
import { createCompany } from '@services/company'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const validationSchema = z.object({
  ruc: z
    .string()
    .regex(/^\d+$/, 'El ruc solo puede contener números')
    .length(11, 'El ruc debe tener exactamente 11 dígitos')
    .min(1, 'El ruc es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').min(1, 'La contraseña es requerida')
})

type IFormCreateCompany = z.infer<typeof validationSchema>

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
    resolver: zodResolver(validationSchema),
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 px-1 max-h-[calc(100vh-150px)] py-2 overflow-y-auto ">
      <FormInput name="ruc" control={control} label="Ruc" formatText={onlyNumbers} maxLength={11} />
      <FormInput name="name" control={control} label="Nombre" />
      <FormInput name="username" control={control} label="Usuario" />
      <FormInput name="password" control={control} label="Contraseña" type="password" />

      <Divider />
      <Button type="submit" disabled={isPending}>
        Crear
      </Button>
    </form>
  )
}
