import { FormCreateExpense, StepData, stepSchemaCreateSpend } from '@components/corporation/expenses/forms/FormCreateExpense'
import { zodResolver } from '@hookform/resolvers/zod'
import { valuesFormData } from '@lib/utils'
import { Button } from '@mui/material'
import { createExpense } from '@services/expense'
import { useMutation } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export const SingleStep = () => {
  const stepsData: StepData = {
    ruc: '',
    companyName: '',
    description: '',
    category: '',
    file: undefined,
    filePreview: '',
    fileVisa: undefined,
    fileVisaPreview: '',
    fileRxh: undefined,
    fileRxhPreview: '',
    currency: '',
    date: '',
    serie: '',
    total: '',
    typeDocument: '',
    rus: true,
    retention: 0
  }

  const methods = useForm<StepData>({
    resolver: zodResolver(stepSchemaCreateSpend),
    defaultValues: stepsData,
    mode: 'onChange'
  })

  const {
    watch,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid }
  } = methods

  const onSubmit = (data: StepData) => {
    console.log({ data })
    mutateCreate(data)
  }

  const { mutate: mutateCreate, isPending } = useMutation({
    mutationFn: createExpense,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      // queryClient.invalidateQueries({ queryKey: ['getAreas'] })
      // onClose()
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-end">
          <Button type="submit">Crear Gasto</Button>
        </div>
        <FormCreateExpense index={0} />
      </form>
    </FormProvider>
  )
}
