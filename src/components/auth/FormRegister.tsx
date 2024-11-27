import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, TextField } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface FormValues {
  name: string
  lastname: string
  identityDocument: string
  phone: string
  email: string
  password: string
}

const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  lastname: yup.string().required('El apellido es requerido'),
  identityDocument: yup.string().min(8, 'El documento debe tener al menos 8 dígitos').required('El documento de identidad es requerido'),
  phone: yup.string().min(8, 'El teléfono debe tener al menos 8 dígitos').required('El teléfono es requerido'),
  email: yup.string().email('Correo invalido').required('El correo es requerido'),
  password: yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida')
})

export const FormRegister = () => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      lastname: '',
      identityDocument: '',
      phone: '',
      email: '',
      password: ''
    }
  })

  const name = watch('name')
  const lastname = watch('lastname')

  const onSubmit = (data: FormValues) => {
    console.log({ data })
  }

  useEffect(() => {
    if (name === 'ricardo' && lastname === 'ricardo') {
      setValue('name', '')
    }
  }, [name, lastname, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Controller
        name="name"
        control={control}
        render={({ field }) => <TextField {...field} label="Nombres" error={!!errors.name} helperText={errors.name?.message} />}
      />

      <Controller
        name="lastname"
        control={control}
        render={({ field }) => <TextField {...field} label="Apellidos" error={!!errors.lastname} helperText={errors.lastname?.message} />}
      />

      <Controller
        name="identityDocument"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Documento de Identidad"
            error={!!errors.identityDocument}
            helperText={errors.identityDocument?.message}
          />
        )}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => <TextField {...field} label="Teléfono" error={!!errors.phone} helperText={errors.phone?.message} />}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField {...field} type="email" label="Correo" error={!!errors.email} helperText={errors.email?.message} />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField {...field} type="password" label="Contraseña" error={!!errors.password} helperText={errors.password?.message} />
        )}
      />

      <Button type="submit" variant="contained">
        Registrarse
      </Button>
    </form>
  )
}
