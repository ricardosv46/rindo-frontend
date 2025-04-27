import { FormInput } from '@components/shared'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createCorporation } from '@services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Divider } from '@components/ui/divider'
import { Button } from '@components/ui/button'

const validationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Correo invalido').min(1, 'El correo es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').min(1, 'La contraseña es requerida')
})

type IFormCreateCorporation = z.infer<typeof validationSchema>

interface FormCreateCorporationProps {
  onClose: () => void
}

export const FormCreateCorporation = ({ onClose }: FormCreateCorporationProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IFormCreateCorporation>({
    resolver: zodResolver(validationSchema),
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
      <FormInput control={control} name="name" label="Nombre" />
      <FormInput control={control} name="email" label="Correo" />
      <FormInput control={control} name="password" label="Contraseña" type="password" />

      <Divider />
      <Button type="submit" disabled={isPending}>
        Crear
      </Button>
    </form>
  )
}
