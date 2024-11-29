import { yupResolver } from '@hookform/resolvers/yup'
import { IArea } from '@interfaces/area'
import { IUser } from '@interfaces/user'
import { Button, Divider, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { addApprover } from '@services/area'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

export interface IFormCreateApprover {
  email: string
  approver?: string
}

const validationSchema = yup.object().shape({
  email: yup.string().required('El correo es requerido')
})
interface FormCreateApproverProps {
  onClose: () => void
  company: string
  area: string
  users: IUser[]
  areas: IArea[]
}
export const FormAddApprover = ({ onClose, company, area, areas, users }: FormCreateApproverProps) => {
  const {
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<IFormCreateApprover>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: ''
    }
  })

  const queryClient = useQueryClient()

  const { mutate: mutateAdd, isPending: isPendingAdd } = useMutation({
    mutationFn: addApprover,
    onError: (error: string) => {
      toast.error(error)
      onClose()
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getApprovers'] })
      queryClient.invalidateQueries({ queryKey: ['getAreas'] })
      onClose()
    }
  })

  const onSubmit = async (values: IFormCreateApprover) => {
    mutateAdd({ id: area, approver: values.email! })
  }

  const usersDisabled = useMemo(() => areas.filter((i) => i?._id === area)[0]?.approvers?.map((i) => i.approver), [areas])

  const filteredUsers = useMemo(() => {
    const data = users.filter((i) => {
      console.log({ i: i.areas, area })
      return (i.company?._id === company && i.areas?.includes(area)) || i.role === 'GLOBAL_APPROVER'
    })

    return data
  }, [users, areas])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-radix-scroll-area-viewport
      className="flex flex-col gap-5 max-h-[calc(100vh-150px)] py-2 overflow-auto">
      <FormControl sx={{ minWidth: 120 }} size="small" error={!!errors.email}>
        <InputLabel id="select-company-label">Empresa</InputLabel>
        <Controller
          name="email"
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
              {filteredUsers.map((user) => (
                <MenuItem key={user._id} value={user._id} disabled={usersDisabled?.includes(user?._id)}>
                  {user.email}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
      </FormControl>
      <Divider />
      <Button type="submit" variant="contained" disabled={isPendingAdd}>
        Agregar
      </Button>
    </form>
  )
}
