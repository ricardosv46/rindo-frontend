import { FormInput, FormSelect } from '@components/shared'
import { FormMultiSelect } from '@components/shared/Forms/FormMultiSelect'
import { Option } from '@components/shared/Forms/FormSelect'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToggle } from '@hooks/useToggle'
import { IArea } from '@interfaces/area'
import { ICompany } from '@interfaces/company'
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { createGlobalApprover, createUser } from '@services/user'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

export interface IFormCreateUser {
  email: string
  name: string
  lastname: string
  role: 'APPROVER' | 'SUBMITTER' | 'GLOBAL_APPROVER'
  company?: string
  areas?: string[]
  password: string
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
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
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
interface FormCreateUserProps {
  onClose: () => void
  companies: ICompany[]
  areas: IArea[]
}

const roles = [
  { label: 'RENDIDOR', value: 'SUBMITTER' },
  { label: 'APROBADOR', value: 'APPROVER' },
  { label: 'APROBADOR GLOBAL', value: 'GLOBAL_APPROVER' }
]

export const FormCreateUser = ({ onClose, companies, areas }: FormCreateUserProps) => {
  const [isOpenPassword, , , togglePassword] = useToggle()
  const [filteredAreas, setFilteredAreas] = useState<IArea[]>([])

  const {
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<IFormCreateUser>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      name: '',
      lastname: '',
      role: 'SUBMITTER',
      company: '',
      areas: [],
      password: '',
      document: '',
      phone: ''
    }
  })

  const queryClient = useQueryClient()
  const { mutate: mutateCreate, isPending: isPendingUser } = useMutation({
    mutationFn: createUser,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getUsers'] })
      onClose()
    }
  })

  const { mutate: mutateCreateGlobalApprover, isPending: isPendingGlobalApprover } = useMutation({
    mutationFn: createGlobalApprover,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getUsers'] })
      onClose()
    }
  })

  const onSubmit = async (values: IFormCreateUser) => {
    if (values?.role === 'GLOBAL_APPROVER') mutateCreateGlobalApprover(values)
    else mutateCreate(values)
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
    if (watch()?.role === 'GLOBAL_APPROVER') {
      setValue('areas', [])
      setValue('company', '')
    }
  }, [watch()?.role])

  const valuesCompanies: Option[] = useMemo(() => {
    if (companies.length > 0) {
      const data = companies.map((i) => ({ label: i.name, value: i._id }))
      return data as Option[]
    } else {
      return [{ label: 'No existen empresas', value: '' }]
    }
  }, [companies])

  const valuesAreas: Option[] = useMemo(() => {
    if (filteredAreas.length > 0) {
      const data = filteredAreas.map((i) => ({ label: i.name, value: i._id }))
      return data as Option[]
    } else {
      return [{ label: 'No existen areas en esa empresa', value: '' }]
    }
  }, [filteredAreas])
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-radix-scroll-area-viewport
      className="flex flex-col gap-5 max-h-[calc(100vh-150px)] py-2 overflow-auto overflow-x-visible">
      <FormInput control={control} name="email" label="Correo" />
      <FormInput control={control} name="name" label="Nombre" />
      <FormInput control={control} name="lastname" label="Apellido" />
      <FormSelect control={control} name="role" label="Rol" placeholder="Selecciona un rol" options={roles} />
      {watch()?.role !== 'GLOBAL_APPROVER' && (
        <FormSelect control={control} name="company" label="Empresa" placeholder="Selecciona una empresa" options={valuesCompanies} />
      )}
      {watch()?.role === 'APPROVER' && (
        <FormMultiSelect control={control} name="areas" label="Areas" placeholder="Selecciona una area" options={valuesAreas} />
      )}
      {watch()?.role === 'SUBMITTER' && (
        <FormControl sx={{ minWidth: 120 }} size="small" error={!!errors.areas}>
          <InputLabel id="select-area-label">Area</InputLabel>
          <Controller
            name="areas"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="select-area-label"
                id="select-area"
                label="Areas"
                disabled={!watch()?.company}
                value={field.value}
                onChange={(event) => {
                  const { value } = event.target
                  field.onChange([value])
                }}
                MenuProps={{
                  disablePortal: true
                }}>
                {filteredAreas.map((area) => (
                  <MenuItem key={area._id} value={area._id}>
                    {area.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.areas && <FormHelperText>{errors.areas.message}</FormHelperText>}
        </FormControl>
      )}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type={isOpenPassword ? 'text' : 'password'}
            label="Contraseña"
            size="small"
            autoComplete="off"
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
      <Controller
        name="document"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Documento"
            size="small"
            error={!!errors.document}
            helperText={errors.document?.message}
            slotProps={{
              htmlInput: { maxLength: 9 }
            }}
          />
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Celular"
            size="small"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            slotProps={{
              htmlInput: { maxLength: 9 }
            }}
          />
        )}
      />
      <Divider />
      <Button type="submit" variant="contained" disabled={isPendingUser || isPendingGlobalApprover}>
        Crear
      </Button>{' '}
    </form>
  )
}
