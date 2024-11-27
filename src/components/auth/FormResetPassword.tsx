import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, TextField } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface FormValues {
  password: string
  newPassword: string
}

const validationSchema = yup.object().shape({
  password: yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida'),
  newPassword: yup.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres').required('La nueva contraseña es requerida')
})

export const FormResetPassword = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
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
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="password"
            label="Contraseña"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />
      <Controller
        name="newPassword"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="password"
            label="Confirmar Contraseña"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
        )}
      />
      <Button type="submit" variant="contained">
        Restablecer Contraseña
      </Button>
    </form>
  )
}
