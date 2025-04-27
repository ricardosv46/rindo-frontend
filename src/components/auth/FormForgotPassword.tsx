import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@components/ui/button'
import { FormInput } from '@components/shared'

const validationSchema = z.object({
  email: z.string().email('Correo invalido').min(1, 'El correo es requerido')
})

type FormValues = z.infer<typeof validationSchema>

export const FormForgotPassword = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (data: FormValues) => {
    console.log({ data })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormInput control={control} name="email" label="Correo" />

      <Button type="submit">Enviar</Button>
    </form>
  )
}
