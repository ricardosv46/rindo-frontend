import { FormInput } from '@components/shared'
import { FormSelect, Option } from '@components/shared/Forms/FormSelect'
import { Button } from '@components/ui/button'
import { Divider } from '@components/ui/divider'
import { zodResolver } from '@hookform/resolvers/zod'
import { ICompany } from '@interfaces/company'
import { createArea } from '@services/area'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const validationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  company: z.string().min(1, 'La empresa es requerida')
})

type IFormCreateArea = z.infer<typeof validationSchema>

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
    resolver: zodResolver(validationSchema),
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

  const valuesCompanies: Option[] = useMemo(() => {
    if (companies.length > 0) {
      const data = companies.map((i) => ({ label: i.name, value: i._id }))
      return data as Option[]
    } else {
      return [{ label: 'No existen empresas', value: '-' }]
    }
  }, [companies])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 px-1 max-h-[calc(100vh-150px)] py-2 overflow-y-auto ">
      <FormInput control={control} name="name" label="Nombre" />
      <FormSelect
        control={control}
        name="company"
        label="Empresa"
        placeholder="Selecciona una empresa"
        options={valuesCompanies}
        disabledOptionsExceptions={valuesCompanies[0].value === '-'}
      />

      <Divider />
      <Button type="submit" disabled={isPending}>
        Crear
      </Button>
    </form>
  )
}
