import { yupResolver } from '@hookform/resolvers/yup'
import { IArea } from '@interfaces/area'
import { IUser } from '@interfaces/user'
import { Button, Divider, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { addApprover } from '@services/area'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState, useMemo } from 'react'
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
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getApprovers'] })
      onClose()
    }
  })

  const onSubmit = async (values: IFormCreateApprover) => {
    mutateAdd({ id: area, approver: values.email! })
  }

  console.log({ users, company, watch: watch() })

  const filteredUsers = useMemo(() => users.filter((i) => i.company?._id === company || i.role === 'GLOBAL_APPROVER'), [users])

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
                <MenuItem key={user._id} value={user._id}>
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
