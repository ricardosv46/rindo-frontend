import { FormInput, FormSelect } from '@components/shared'
import { FormMultiSelect } from '@components/shared/Forms/FormMultiSelect'
import { Option } from '@components/shared/Forms/FormSelect'
import { Button } from '@components/ui/button'
import { Divider } from '@components/ui/divider'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IArea } from '@interfaces/area'
import { ICompany } from '@interfaces/company'
import { IUser } from '@interfaces/user'
import { onlyNumbers } from '@lib/utils'

import { updateUser } from '@services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const validationSchema = z.object({
  email: z.string().email('Correo inválido').min(1, 'El correo es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  lastname: z.string().min(1, 'El apellido es requerido'),
  role: z.enum(['APPROVER', 'SUBMITTER', 'GLOBAL_APPROVER'], {
    errorMap: () => ({ message: 'El rol es requerido' })
  }),
  company: z
    .string()
    .optional()
    .refine(
      (val) => {
        const role = z.string().parse(val)
        return role !== 'GLOBAL_APPROVER' ? !!val : true
      },
      { message: 'La empresa es requerida' }
    ),
  areas: z
    .array(z.string())
    .optional()
    .refine(
      (val) => {
        const role = z.string().parse(val)
        return role !== 'GLOBAL_APPROVER' ? (val?.length ?? 0) > 0 : true
      },
      { message: 'Debe escoger al menos un área' }
    ),
  document: z
    .string()
    .regex(/^\d+$/, 'El documento solo puede contener números')
    .min(8, 'El documento debe tener 8 o 9 dígitos')
    .max(9, 'El documento debe tener 8 o 9 dígitos')
    .min(1, 'El documento es requerido'),
  phone: z
    .string()
    .regex(/^\d+$/, 'El número de teléfono solo puede contener números')
    .length(9, 'El número de teléfono debe tener exactamente 9 dígitos')
    .min(1, 'El número de teléfono es requerido')
})

type IFormUpdateUser = z.infer<typeof validationSchema>

interface FormUpdateUserProps {
  onClose: () => void
  companies: ICompany[]
  areas: IArea[]
  data?: IUser | null
}

const roles = [
  { label: 'RENDIDOR', value: 'SUBMITTER' },
  { label: 'APROBADOR', value: 'APPROVER' },
  { label: 'APROBADOR GLOBAL', value: 'GLOBAL_APPROVER' }
]

export const FormUpdateUser = ({ onClose, companies, areas, data }: FormUpdateUserProps) => {
  const [filteredAreas, setFilteredAreas] = useState<IArea[]>([])

  const {
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<IFormUpdateUser>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: data?.email,
      name: data?.name,
      lastname: data?.name,
      role: data?.role as 'APPROVER' | 'SUBMITTER' | 'GLOBAL_APPROVER',
      company: data?.company?._id,
      areas: data?.areas,
      document: data?.document,
      phone: data?.phone
    }
  })

  const queryClient = useQueryClient()
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationFn: updateUser,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getUsers'] })
      onClose()
    }
  })

  const onSubmit = async (values: IFormUpdateUser) => {
    mutateUpdate({ id: data?._id, ...values })
  }

  useEffect(() => {
    setValue('areas', [])
    if (watch()?.company) {
      const filtered = areas.filter((area) => area.company?._id === watch()?.company)
      setFilteredAreas(filtered)
    } else {
      setFilteredAreas([])
    }
  }, [watch()?.company])

  useEffect(() => {
    setValue('areas', data?.areas)
  }, [])

  const valuesCompanies: Option[] = useMemo(() => {
    if (companies.length > 0) {
      const data = companies.map((i) => ({ label: i.name, value: i._id }))
      return data as Option[]
    } else {
      return [{ label: 'No existen empresas', value: '-' }]
    }
  }, [companies])

  const valuesAreas: Option[] = useMemo(() => {
    if (filteredAreas.length > 0) {
      const data = filteredAreas.map((i) => ({ label: i.name, value: i._id }))
      return data as Option[]
    } else {
      return [{ label: 'No existen areas en esa empresa', value: '-' }]
    }
  }, [filteredAreas])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-radix-scroll-area-viewport
      className="flex flex-col gap-3 px-1 max-h-[calc(100vh-150px)] py-2 overflow-x-visible overflow-y-scroll ">
      <FormInput control={control} name="email" label="Correo" />
      <FormInput control={control} name="name" label="Nombre" />
      <FormInput control={control} name="lastname" label="Apellido" />
      <FormSelect control={control} name="role" label="Rol" placeholder="Selecciona un rol" options={roles} disabled />
      {watch()?.role !== 'GLOBAL_APPROVER' && (
        <FormSelect
          control={control}
          name="company"
          label="Empresa"
          disabled={!!watch().company}
          placeholder="Selecciona una empresa"
          options={valuesCompanies}
          disabledOptionsExceptions={valuesCompanies[0].value === '-'}
        />
      )}
      {watch()?.role === 'APPROVER' && (
        <FormMultiSelect
          control={control}
          name="areas"
          label="Areas"
          placeholder="Selecciona una area"
          options={valuesAreas}
          disabled={!watch()?.company}
          disabledOptionsExceptions={valuesAreas[0].value === '-'}
        />
      )}
      {watch()?.role === 'SUBMITTER' && (
        <FormSelect
          control={control}
          name="areas"
          label="Area"
          placeholder="Selecciona una area"
          options={valuesAreas}
          disabled={!watch()?.company}
          disabledOptionsExceptions={valuesAreas[0].value === '-'}
        />
      )}
      <FormInput control={control} name="document" label="Documento" maxLength={9} formatText={onlyNumbers} />
      <FormInput control={control} name="phone" label="Celular" maxLength={9} formatText={onlyNumbers} />
      <Divider />

      <Button type="submit" disabled={isPendingUpdate}>
        Actualizar
      </Button>
    </form>
  )
}
