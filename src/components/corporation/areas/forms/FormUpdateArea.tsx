import { FormInput } from '@components/shared'
import { Button } from '@components/ui/button'
import { Divider } from '@components/ui/divider'
import { zodResolver } from '@hookform/resolvers/zod'
import { IArea } from '@interfaces/area'
import { updateArea } from '@services/area'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const validationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido')
})

type IFormUpdateArea = z.infer<typeof validationSchema>

interface FormUpdateAreaProps {
  onClose: () => void
  data?: IArea | null
}

export const FormUpdateArea = ({ onClose, data }: FormUpdateAreaProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IFormUpdateArea>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: data?.name
    }
  })

  const onSubmit = async (values: IFormUpdateArea) => {
    mutateUpdate({ ...values, id: data?._id })
  }

  const queryClient = useQueryClient()
  const { mutate: mutateUpdate, isPending } = useMutation({
    mutationFn: updateArea,
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 px-1 max-h-[calc(100vh-150px)] py-2  overflow-y-auto ">
      <FormInput control={control} name="name" label="Nombre" />
      <Divider />
      <Button type="submit" disabled={isPending}>
        Actualizar
      </Button>
    </form>
  )
}
