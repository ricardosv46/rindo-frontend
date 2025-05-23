import { FormCreateExpense, StepData, stepSchemaCreateSpend } from '@components/corporation/expenses/forms/FormCreateExpense'
import { Spinner } from '@components/shared'
import { Button } from '@components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from '@hooks/useToggle'
import { TypeDocument } from '@interfaces/expense'
import { cn, removeAccents, valuesFormData } from '@lib/utils'
import { createExpense, getOcrExpense } from '@services/expense'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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
    rus: false,
    retention: 0
  }

  const methods = useForm<StepData>({
    resolver: zodResolver(stepSchemaCreateSpend),
    defaultValues: stepsData,
    mode: 'onChange'
  })
  const [loading, openLoading, closeLoading] = useToggle()

  const {
    watch,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState: { errors, isValid }
  } = methods

  const onSubmit = (data: StepData) => {
    mutateCreate(data)
  }
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: mutateCreate, isPending } = useMutation({
    mutationFn: createExpense,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getExpenses'] })
      navigate('/expenses')
    }
  })

  const getDataOcr = async (file: File) => {
    try {
      if (file) {
        resetValues()
        openLoading()
        const { data } = await getOcrExpense({ file })
        setValue('category', data?.category)
        setValue('companyName', data?.companyName)
        setValue('currency', data?.currency)
        setValue('date', data?.date)
        setValue('description', data?.description)
        setValue('typeDocument', removeAccents(data?.typeDocument) as TypeDocument)
        setValue('rus', data?.rus)
        setValue('ruc', data?.ruc)
        setValue('serie', data?.serie)
        setValue('total', String(data?.total))
        setValue('retention', data?.retention)
        closeLoading()
      }
    } catch (error: any) {
      toast.error(error)
      closeLoading()
    }
  }

  const resetValues = () => {
    setValue('category', '')
    setValue('companyName', '')
    setValue('currency', '')
    setValue('date', '')
    setValue('description', '')
    setValue('typeDocument', '')
    setValue('rus', false)
    setValue('ruc', '')
    setValue('serie', '')
    setValue('total', '')
    setValue('retention', 0)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-8">
        {loading && (
          <div className="absolute top-0 right-0 z-10 flex items-center justify-center w-full h-full ">
            <Spinner />
          </div>
        )}

        <FormCreateExpense index={0} loading={loading} getDataOcr={getDataOcr} className="mt-5" />
        <div className={cn('flex justify-end mt-10', loading && 'opacity-50')}>
          <Button type="submit" disabled={isPending}>
            Crear Gasto
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
