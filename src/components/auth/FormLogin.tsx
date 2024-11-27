import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, IconButton, InputAdornment, TextField } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { getDetail, login } from '@services/auth'
import { useAuth } from '@store/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useToggle } from '@hooks/useToggle'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

interface FormValues {
  email: string
  password: string
}

const validationSchema = yup.object().shape({
  email: yup.string().email('Correo invalido').required('El correo es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida')
})

export const FormLogin = () => {
  const [isOpenPassword, , , togglePassword] = useToggle()

  const { loginAction } = useAuth()
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
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
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField {...field} color="primary" type="text" label="Correo" error={!!errors.email} helperText={errors.email?.message} />
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
      <p className="text-sm font-semibold text-primary-600">¿Olvidaste tu contraseña?</p>
      <Button type="submit" variant="contained" disabled={isPending}>
        Iniciar Sesión
      </Button>
    </form>
  )
}
