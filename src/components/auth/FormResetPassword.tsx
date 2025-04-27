import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormInput } from '@components/shared'
import { Button } from '@components/ui/button'

const validationSchema = z.object({
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').min(1, 'La contraseña es requerida'),
  newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres').min(1, 'La nueva contraseña es requerida')
})

type FormValues = z.infer<typeof validationSchema>

export const FormResetPassword = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      password: '',
      newPassword: ''
    }
  })

  const onSubmit = (values: FormValues) => {
    console.log({ values })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormInput control={control} name="password" label="Contraseña" type="password" />
      <FormInput control={control} name="newPassword" label="Confirmar Contraseña" type="password" />

      <Button type="submit">Restablecer Contraseña</Button>
    </form>
  )
}
