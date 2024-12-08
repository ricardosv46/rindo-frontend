import { categories, currencies, typeDocuments } from '@/constants'
import { InputSelect, InputText } from '@components/shared'
import { FileUpload } from '@components/shared/FileUpload/FileUpload'
import { InputPicker } from '@components/shared/Inputs/InputPicker'
import { zodResolver } from '@hookform/resolvers/zod'
import { onlyNumbers } from '@lib/utils'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'

type StepData = {
  ruc?: string
  companyName?: string
  description?: string
  file?: File
  filePreview?: string
  fileVisa?: File
  fileVisaPreview?: string
  fileRxh?: File
  fileRxhPreview?: string
  category?: string
  total?: string
  currency?: string
  serie?: string
  date?: string
  typeDocument?: string
}
const stepSchema = z
  .object({
    ruc: z
      .string()
      .min(1, 'El RUC es obligatorio.')
      .length(11, 'El RUC debe tener 11 caracteres.')
      .regex(/^\d+$/, 'El RUC solo puede contener números.'),
    companyName: z.string().min(1, 'El Razón social es obligatoria.'),
    description: z.string().min(1, 'La descripción es obligatoria.'),
    category: z.string().min(1, 'La categoría es obligatoria.'),
    total: z.string().min(1, 'El totaldata es obligatorio.'),
    currency: z.string().min(1, 'La moneda es obligatoria.'),
    serie: z.string().optional(),
    date: z.string().min(1, 'La fecha de emisión es obligatoria.'),
    typeDocument: z.string().min(1, 'El tipo de documento es obligatorio.'),
    file: z.instanceof(File),
    filePreview: z.string().min(1, 'El archivo es obligatorio.'),
    fileVisa: z.instanceof(File).optional(),
    fileVisaPreview: z.string().optional(),
    fileRxh: z.instanceof(File).optional(),
    fileRxhPreview: z.string().optional()
  })
  .partial()
  .refine(
    (data) => {
      const isBoletaOrFactura = data.typeDocument === 'BOLETA DE VENTA' || data.typeDocument === 'FACTURA ELECTRONICA'
      return !isBoletaOrFactura || (isBoletaOrFactura && data.serie)
    },
    {
      message: 'La serie es obligatoria.',
      path: ['serie']
    }
  )
const Step: React.FC<{ index: number; data: StepData; onChange: (data: Partial<StepData>) => void }> = ({ index, data, onChange }) => {
  const {
    watch,
    getValues,
    register,
    setValue,
    control,
    clearErrors,
    formState: { errors }
  } = useFormContext<StepData>()

  const handleFileChange = (file: File | undefined, filePreview: string | undefined) => {
    setValue('file', file)
    setValue('filePreview', filePreview)
    clearErrors(['file', 'filePreview'])
  }

  const handleFileChangeVisa = (file: File | undefined, filePreview: string | undefined) => {
    setValue('fileVisa', file)
    setValue('fileVisaPreview', filePreview)
    clearErrors(['fileVisa', 'fileVisaPreview'])
  }

  const handleFileChangeRxh = (file: File | undefined, filePreview: string | undefined) => {
    setValue('fileRxh', file)
    setValue('fileRxhPreview', filePreview)
    clearErrors(['fileRxh', 'fileRxhPreview'])
  }
  const { typeDocument } = watch()

  const showSerie = typeDocument === 'BOLETA DE VENTA' || typeDocument === 'FACTURA ELECTRONICA'

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Step {index + 1}</h2>
      <section className="grid grid-cols-2">
        <div className="flex items-start justify-center">
          <div className="grid w-full grid-cols-2 gap-5">
            <InputText control={control} name="ruc" errors={errors} label="Ruc" maxLength={11} formatText={onlyNumbers} />

            <InputText control={control} name="companyName" errors={errors} label="Razon Social" />

            <InputText control={control} name="description" errors={errors} label="Descripción" className="col-span-2" />

            <InputSelect control={control} name="category" errors={errors} label="Categoría" data={categories} />

            <InputPicker control={control} name="date" errors={errors} label="Fecha de Emisión" />

            <InputText control={control} name="total" errors={errors} label="Total" />

            <InputSelect control={control} name="currency" errors={errors} label="Moneda" data={currencies} />

            <InputSelect control={control} name="typeDocument" errors={errors} label="Documento" data={typeDocuments} />

            {showSerie && <InputText control={control} name="serie" errors={errors} label="Serie" />}
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-5 px-5 ">
          <Controller
            name="filePreview"
            control={control}
            render={({ field }) => (
              <FileUpload
                name="filePreview"
                value={watch().filePreview}
                file={watch().file}
                onFileChange={handleFileChange}
                errors={errors}
              />
            )}
          />
          <Controller
            name="fileVisaPreview"
            control={control}
            render={({ field }) => (
              <FileUpload
                name="fileVisaPreview"
                value={watch().fileVisaPreview}
                file={watch().fileVisa}
                onFileChange={handleFileChangeVisa}
                errors={errors}
              />
            )}
          />
          <Controller
            name="fileRxhPreview"
            control={control}
            render={({ field }) => (
              <FileUpload
                name="fileRxhPreview"
                value={watch().fileRxhPreview}
                file={watch().fileRxh}
                onFileChange={handleFileChangeRxh}
                errors={errors}
              />
            )}
          />
        </div>
      </section>
    </div>
  )
}

const PageExpensesCorporation = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [numSteps] = useState(5)
  const [stepsData, setStepsData] = useState<StepData[]>(
    Array(numSteps)
      .fill({})
      .map(() => ({
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
        typeDocument: ''
      }))
  )

  const methods = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: stepsData[currentStep],
    mode: 'onChange'
  })

  const {
    watch,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid }
  } = methods

  useEffect(() => {
    reset(stepsData[currentStep])
  }, [currentStep])

  useEffect(() => {
    const subscription = watch((value) => {
      const updatedStepsData = [...stepsData]
      updatedStepsData[currentStep] = { ...updatedStepsData[currentStep], ...value }
      setStepsData(updatedStepsData)
    })
    return () => subscription.unsubscribe()
  }, [watch, currentStep, stepsData])

  const onSubmit = (data: StepData) => {
    const updatedStepsData = [...stepsData]
    updatedStepsData[currentStep] = data
    setStepsData(updatedStepsData)

    if (currentStep < numSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      console.log('All steps data:', updatedStepsData)
    }
  }

  const handleStepChange = (stepData: Partial<StepData>) => {
    const updatedStepsData = [...stepsData]
    updatedStepsData[currentStep] = { ...updatedStepsData[currentStep], ...stepData }
    setStepsData(updatedStepsData)
  }

  const handleNext = async () => {
    const isStepValid = await trigger() // Específico para los campos que activan `refine`

    if (isStepValid) {
      handleSubmit(onSubmit)()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between">
          <Button type="button" onClick={handlePrevious} disabled={currentStep === 0}>
            Anterior
          </Button>
          {currentStep < numSteps - 1 ? (
            <Button type="button" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
        <Step index={currentStep} data={stepsData[currentStep]} onChange={handleStepChange} />
      </form>
    </FormProvider>
  )
}

export default PageExpensesCorporation
