import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface FormValues {
  email: string
}

const validationSchema = yup.object().shape({
  email: yup.string().email('Correo invalido').required('El correo es requerido')
})

export const FormForgotPassword = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (data: FormValues) => {
    console.log({ data })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField {...field} color="primary" type="email" label="Correo" error={!!errors.email} helperText={errors.email?.message} />
        )}
      />
      <Button type="submit" variant="contained">
        Enviar
      </Button>
    </form>
  )
}
