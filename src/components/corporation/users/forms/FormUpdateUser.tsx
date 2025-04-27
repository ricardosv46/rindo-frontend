import { FormInput, FormSelect } from '@components/shared'
import { FormMultiSelect } from '@components/shared/Forms/FormMultiSelect'
import { Option } from '@components/shared/Forms/FormSelect'
import { Button } from '@components/ui/button'
import { Divider } from '@components/ui/divider'
import { yupResolver } from '@hookform/resolvers/yup'
import { IArea } from '@interfaces/area'
import { ICompany } from '@interfaces/company'
import { IUser } from '@interfaces/user'
import { onlyNumbers } from '@lib/utils'

import { updateUser } from '@services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

type Role = 'APPROVER' | 'SUBMITTER' | 'GLOBAL_APPROVER'
export interface IFormUpdateUser {
  email: string
  name: string
  lastname: string
  role: Role
  company?: string
  areas?: string[]
  document: string
  phone: string
}

const validationSchema = yup.object().shape({
  email: yup.string().email('Correo inválido').required('El correo es requerido'),
  name: yup.string().required('El nombre es requerido'),
  lastname: yup.string().required('El apellido es requerido'),
  role: yup.string().oneOf(['APPROVER', 'SUBMITTER', 'GLOBAL_APPROVER'], 'El rol es requerido').required('El rol es requerido'),
  company: yup.string().when('role', {
    is: (role: string) => role !== 'GLOBAL_APPROVER',
    then: (schema) => schema.required('La empresa es requerida'),
    otherwise: (schema) => schema.notRequired()
  }),
  areas: yup.array().when('role', {
    is: (role: string | undefined) => role !== 'GLOBAL_APPROVER',
    then: (schema) => schema.of(yup.string().required('El área es requerida')).min(1, 'Debe escoger al menos un área'),
    otherwise: (schema) => schema.notRequired()
  }),
  document: yup
    .string()
    .matches(/^\d+$/, 'El documento solo puede contener números ')
    .min(8, 'El documento debe tener 8 o 9 dígitos')
    .max(9, 'El documento debe tener 8 o 9 dígitos')
    .required('El documento es requerido'),
  phone: yup
    .string()
    .matches(/^\d+$/, 'El número de teléfono solo puede contener números')
    .length(9, 'El número de teléfono debe tener exactamente 9 dígitos')
    .required('El número de teléfono es requerido')
})
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
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: data?.email,
      name: data?.name,
      lastname: data?.name,
      role: data?.role as Role,
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
