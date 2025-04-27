import { FormSelect } from '@components/shared'
import { Option } from '@components/shared/Forms/FormSelect'
import { Button } from '@components/ui/button'
import { Divider } from '@components/ui/divider'
import { yupResolver } from '@hookform/resolvers/yup'
import { IArea } from '@interfaces/area'
import { IUser } from '@interfaces/user'
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

  const usersDisabled = useMemo(
    () =>
      areas
        .find((i) => i?._id === area)
        ?.approvers?.map((i) => i.approver)
        .filter((id): id is string => id !== undefined) ?? [],
    [areas]
  )

  const filteredUsers = useMemo(() => {
    const data = users.filter((i) => {
      console.log({ i: i.areas, area })
      return (i.company?._id === company && i.areas?.includes(area)) || i.role === 'GLOBAL_APPROVER'
    })

    return data
  }, [users, areas])

  const valuesUsers: Option[] = useMemo(() => {
    if (filteredUsers.length > 0) {
      const data = filteredUsers.map((i) => ({ label: i.email, value: i._id }))
      return data as Option[]
    } else {
      return [{ label: 'No existen areas en esa empresa', value: '-' }]
    }
  }, [filteredUsers])

  console.log({ usersDisabled })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-radix-scroll-area-viewport
      className="flex flex-col gap-5 max-h-[calc(100vh-150px)] py-2 overflow-auto">
      <FormSelect
        control={control}
        name="email"
        label="Correo"
        placeholder="Selecciona una area"
        options={valuesUsers}
        disableOptionsValues={true}
        disableValues={usersDisabled}
      />
      <Divider />
      <Button type="submit" disabled={isPendingAdd}>
        Agregar
      </Button>
    </form>
  )
}
