import { yupResolver } from '@hookform/resolvers/yup'
import { IArea } from '@interfaces/area'
import { ICompany } from '@interfaces/company'
import { IUser } from '@interfaces/user'
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { updateUser } from '@services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
    .length(9, 'El documento debe tener 8 o 9 dígitos')
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-radix-scroll-area-viewport
      className="flex flex-col gap-5 max-h-[calc(100vh-150px)] py-2 overflow-auto">
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Correo"
            size="small"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Nombre"
            size="small"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />
      <Controller
        name="lastname"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            color="primary"
            type="text"
            label="Apellido"
            size="small"
            error={!!errors.lastname}
            helperText={errors.lastname?.message}
          />
        )}
      />
      <FormControl sx={{ minWidth: 120 }} size="small" error={!!errors.role}>
        <InputLabel id="select-company-label">Rol</InputLabel>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onChange={(e) => {
                if (e.target.value === 'GLOBAL_APPROVER') {
                  setValue('areas', [])
                  setValue('company', '')
                }
                field.onChange(e)
              }}
              labelId="select-company-label"
              id="select-company"
              label="Rol"
              defaultValue=""
              MenuProps={{
                disablePortal: true
              }}>
              <MenuItem value={'SUBMITTER'}>RENDIDOR</MenuItem>
              <MenuItem value={'APPROVER'}>APROBADOR</MenuItem>
              <MenuItem value={'GLOBAL_APPROVER'}>APROBADOR GLOBAL</MenuItem>
            </Select>
          )}
        />
        {errors.company && <FormHelperText>{errors.company.message}</FormHelperText>}
      </FormControl>
      {watch()?.role !== 'GLOBAL_APPROVER' && (
        <FormControl sx={{ minWidth: 120 }} size="small" error={!!errors.company}>
          <InputLabel id="select-company-label">Empresa</InputLabel>
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="select-company-label"
                id="select-company"
                label="Empresa"
                defaultValue=""
                MenuProps={{
                  disablePortal: true
                }}>
                {companies.map((company) => (
                  <MenuItem key={company._id} value={company._id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.company && <FormHelperText>{errors.company.message}</FormHelperText>}
        </FormControl>
      )}
      {watch()?.role === 'APPROVER' && (
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
                multiple
                value={field.value}
                onChange={(event) => {
                  const { value } = event.target
                  field.onChange(typeof value === 'string' ? value.split(',') : value)
                }}
                renderValue={(selected) =>
                  filteredAreas
                    .filter((area) => selected.includes(area?._id ?? ''))
                    .map((area) => area.name)
                    .join(', ')
                }
                MenuProps={{
                  disablePortal: true
                }}>
                {filteredAreas.length > 0 &&
                  filteredAreas.map((area) => (
                    <MenuItem key={area._id} value={area._id}>
                      <Checkbox checked={field?.value?.includes(area?._id ?? '')} />
                      <ListItemText primary={area.name} />
                    </MenuItem>
                  ))}

                {filteredAreas.length === 0 && <MenuItem value={''}>No existen areas en esa empresa</MenuItem>}
              </Select>
            )}
          />
          {errors.areas && <FormHelperText>{errors.areas.message}</FormHelperText>}
        </FormControl>
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
      <Button type="submit" variant="contained" disabled={isPendingUpdate}>
        Actualizar
      </Button>{' '}
    </form>
  )
}
