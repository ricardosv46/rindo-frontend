import { FormCreateExpense, StepData, stepSchemaCreateSpend } from '@components/corporation/expenses/forms/FormCreateExpense'
import { Spinner } from '@components/shared'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from '@hooks/useToggle'
import { Category, Currency, IExpense, TypeDocument } from '@interfaces/expense'
import { cn, removeAccents } from '@lib/utils'
import { editExpense, getOcrExpense } from '@services/expense'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/ui/button'

export const EditStep = ({ data }: { data: IExpense }) => {
  const stepsData: StepData = {
    ruc: data?.ruc,
    companyName: data?.companyName,
    description: data?.description,
    category: data?.category as Category,
    file: undefined,
    filePreview: data?.file,
    fileVisa: undefined,
    fileVisaPreview: data?.fileVisa,
    fileRxh: undefined,
    fileRxhPreview: data?.fileRxh,
    currency: data?.currency as Currency,
    date: data?.date,
    serie: data?.serie,
    total: String(data?.total),
    typeDocument: data?.typeDocument as TypeDocument,
    rus: false,
    retention: 0
  }

  const methods = useForm<StepData>({
    resolver: zodResolver(stepSchemaCreateSpend),
    defaultValues: stepsData,
    mode: 'onChange'
  })

  const [isInitialized, openInitialized] = useToggle()
  const [fileChange, openFileChange] = useToggle()
  const [fileVisaChange, openFileVisaChange] = useToggle()
  const [fileRxhChange, openFileRxhChange] = useToggle()
  const [loading, openLoading, closeLoading] = useToggle()
  const {
    watch,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState: { errors, isValid }
  } = methods

  const onSubmit = (props: StepData) => {
    const dataProps = {
      ...props,
      file: fileChange ? props?.file : undefined,
      fileVisa: fileVisaChange ? props?.fileVisa : undefined,
      fileRxh: fileRxhChange ? props?.fileRxh : undefined,
      id: data?._id,
      ...(data?.status === 'IN_REVIEW' && { status: data?.status })
    }
    mutateEdit(dataProps)
  }

  useEffect(() => {
    setTimeout(() => {
      openInitialized()
    }, 1000)
  }, [])

  const { file, fileVisa, fileRxh } = watch()

  useEffect(() => {
    if (isInitialized && file) {
      openFileChange()
    }
  }, [file])

  useEffect(() => {
    if (isInitialized && fileVisa) {
      openFileVisaChange()
    }
  }, [fileVisa])
  useEffect(() => {
    if (isInitialized && fileRxh) {
      openFileRxhChange()
    }
  }, [fileRxh])
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: mutateEdit, isPending } = useMutation({
    mutationFn: editExpense,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getExpenses'] })
      if (data?.status === 'IN_REVIEW') {
        navigate('/review')
      } else {
        navigate('/expenses')
      }
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
            {data?.status === 'IN_REVIEW' ? 'Terminar Revisión' : 'Actualizar Gasto'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
