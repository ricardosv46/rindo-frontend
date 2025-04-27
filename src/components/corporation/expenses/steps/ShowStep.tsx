import { StepData, stepSchemaCreateSpend } from '@components/corporation/expenses/forms/FormCreateExpense'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category, Currency, IExpense, TypeDocument } from '@interfaces/expense'
import { FormProvider, useForm } from 'react-hook-form'
import { FormShowExpense } from '../forms/FormShowExpense'
import { Divider } from '@components/ui/divider'

export const ShowStep = ({ data }: { data: IExpense }) => {
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

  const {
    watch,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState: { errors, isValid }
  } = methods

  return (
    <FormProvider {...methods}>
      <div>
        <p className="mb-5 text-2xl font-bold">Detalle Gasto</p>
        <Divider className="relative space-y-8" />
        <FormShowExpense className="mt-5" />
      </div>
    </FormProvider>
  )
}
