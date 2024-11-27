import { yupResolver } from '@hookform/resolvers/yup'
import { ICompany } from '@interfaces/company'
import { Button, Divider, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { createArea } from '@services/area'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

export interface IFormCreateArea {
  name: string
  company: string
}

const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  company: yup.string().required('La empresa es requerida')
})
interface FormCreateAreaProps {
  onClose: () => void
  companies: ICompany[]
}
export const FormCreateArea = ({ onClose, companies }: FormCreateAreaProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IFormCreateArea>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      company: ''
    }
  })

  const onSubmit = async (values: IFormCreateArea) => {
    console.log({ values })
    mutateCreate({ ...values })
  }
  const queryClient = useQueryClient()
  const { mutate: mutateCreate, isPending } = useMutation({
    mutationFn: createArea,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getAreas'] })
      onClose()
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-h-[calc(100vh-150px)] py-2 overflow-auto">
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
        />{' '}
        {errors.company && <FormHelperText>{errors.company.message}</FormHelperText>}
      </FormControl>

      <Divider />
      <Button type="submit" variant="contained" disabled={isPending}>
        Crear
      </Button>
    </form>
  )
}
