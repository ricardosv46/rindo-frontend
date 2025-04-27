import { FormInput } from '@components/shared'
import { Button } from '@components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const validationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  lastname: z.string().min(1, 'El apellido es requerido'),
  identityDocument: z.string().min(8, 'El documento debe tener al menos 8 dígitos').min(1, 'El documento de identidad es requerido'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos').min(1, 'El teléfono es requerido'),
  email: z.string().email('Correo invalido').min(1, 'El correo es requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').min(1, 'La contraseña es requerida')
})

type FormValues = z.infer<typeof validationSchema>

export const FormRegister = () => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
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
      <FormInput control={control} name="name" label="Nombres" />
      <FormInput control={control} name="lastname" label="Apellidos" />
      <FormInput control={control} name="identityDocument" label="Documento de Identidad" />
      <FormInput control={control} name="phone" label="Teléfono" />
      <FormInput control={control} name="email" label="Correo" />
      <FormInput control={control} name="password" label="Contraseña" type="password" />

      <Button type="submit">Registrarse</Button>
    </form>
  )
}
