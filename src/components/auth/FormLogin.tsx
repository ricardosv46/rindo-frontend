import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getDetail, login } from '@services/auth'
import { useAuth } from '@store/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useToggle } from '@hooks/useToggle'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { FormInput } from '@components/shared'
import { Button } from '@components/ui/button'

const validationSchema = z.object({
  email: z.string().email('Correo invalido').min(1, 'El correo es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').min(1, 'La contraseña es requerida')
})

type FormValues = z.infer<typeof validationSchema>

export const FormLogin = () => {
  const { loginAction } = useAuth()
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: FormValues) => {
    mutateLogin(values)
  }

  const { mutate: mutateLogin, isPending } = useMutation({
    mutationFn: login,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ token }) => {
      const detail = await getDetail()
      loginAction(token, detail)
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormInput control={control} name="email" label="Correo" />

      <FormInput control={control} name="password" label="Contraseña" type="password" />

      <p className="text-sm font-semibold text-primary-600">¿Olvidaste tu contraseña?</p>
      <Button type="submit" disabled={isPending}>
        Iniciar Sesión
      </Button>
    </form>
  )
}
