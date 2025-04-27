import { StepData, FormCreateExpense, stepSchemaCreateSpend } from '@components/corporation/expenses/forms/FormCreateExpense'
import { Spinner } from '@components/shared'
import { FileUploadMultiple } from '@components/shared/Files/FileUploadMultiple'
import { Button } from '@components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from '@hooks/useToggle'
import { TypeDocument } from '@interfaces/expense'
import { removeAccents } from '@lib/utils'
import { createExpense, getOcrExpense } from '@services/expense'
import { useMutation } from '@tanstack/react-query'
import { Watch } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
interface ShowFormProps {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
}

const initalData: StepData = {
  loadedFile: false,
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
export const MultipleStep = () => {
  const [files, setFiles] = useState<File[]>([])

  const [view, setView] = useState<'files' | 'form'>('files')

  const handleSelect = async () => {
    setView('form')
  }

  return (
    <div>
      {view === 'files' && (
        <div className="mt-5">
          <FileUploadMultiple files={files} setFiles={setFiles} />
          <div className="flex justify-end mt-5">
            <Button type="button" onClick={handleSelect} disabled={files?.length === 0}>
              Cargar
            </Button>
          </div>
        </div>
      )}

      {view === 'form' && <ShowForm {...{ files, setFiles }} />}
    </div>
  )
}

const ShowForm = ({ files, setFiles }: ShowFormProps) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, openLoading, closeLoading] = useToggle()
  const [stepsData, setStepsData] = useState<StepData[]>(files.map((i, index) => ({ ...initalData })))

  useEffect(() => {
    const processFiles = async () => {
      const promises = files.map((file) => {
        return new Promise<StepData>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const filePreview = reader.result as string
            resolve({ ...initalData, file, filePreview })
          }
          reader.readAsDataURL(file)
        })
      })

      const results = await Promise.all(promises)
      setStepsData(results)
      reset(results[0])
      getDataOcr(results[0]?.file!)
    }

    processFiles()
  }, [])

  const methods = useForm<StepData>({
    resolver: zodResolver(stepSchemaCreateSpend),
    defaultValues: stepsData[0]
  })

  const {
    watch,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState: { errors, isValid },
    clearErrors
  } = methods

  const onSubmit = async (data: StepData) => {
    const updatedStepsData = updateStepData(currentStep, data, stepsData)
    const newStep = currentStep + 1

    if (currentStep < stepsData?.length - 1) {
      const stepDataNext = updatedStepsData[newStep]
      updateStepData(newStep, { ...stepDataNext }, updatedStepsData)
      reset(stepDataNext)
      setCurrentStep(newStep)

      const { loadedFile } = stepDataNext
      if (!loadedFile) {
        await getDataOcr(stepDataNext?.file!)
      }
    } else {
      openLoading()
      for (const step of updatedStepsData) {
        await mutateCreateAsync(step)
      }
      closeLoading()
      navigate('/expenses')
      console.log('All steps data:', data)
    }
  }

  const {
    mutate: mutateCreate,
    mutateAsync: mutateCreateAsync,
    isPending
  } = useMutation({
    mutationFn: createExpense,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
    }
  })

  const updateStepData = (step: number, data: StepData, baseData: StepData[]) => {
    const updatedStepsData = [...baseData]
    updatedStepsData[step] = data
    setStepsData(updatedStepsData)

    return updatedStepsData
  }

  const handlePrevious = () => {
    const updatedStepsData = [...stepsData]
    updatedStepsData[currentStep] = watch()
    setStepsData(updatedStepsData)

    if (currentStep > 0) {
      const updatedStepsDataPreview = [...updatedStepsData]
      updatedStepsDataPreview[currentStep - 1] = { ...updatedStepsDataPreview[currentStep - 1] }
      reset(updatedStepsDataPreview[currentStep - 1])
      setStepsData(updatedStepsDataPreview)
      setCurrentStep(currentStep - 1)
    }
  }

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
        setValue('loadedFile', true)
        closeLoading()
      }
    } catch (error: any) {
      toast.error(error)
      closeLoading()
    }
  }

  const resetValues = () => {
    reset({ file: watch()?.file, filePreview: watch()?.filePreview })
  }

  return (
    <FormProvider {...methods}>
      {loading && (
        <div className="absolute top-0 right-0 z-10 flex items-center justify-center w-full h-full ">
          <Spinner />
        </div>
      )}

      {stepsData?.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-end gap-3">
            <Button type="button" onClick={handlePrevious} disabled={currentStep === 0}>
              Anterior
            </Button>
            {currentStep < files?.length - 1 ? <Button type="submit">Siguiente</Button> : <Button type="submit">Crear Gastos</Button>}
          </div>
          <FormCreateExpense index={currentStep} multiple loading={loading} getDataOcr={getDataOcr} />
        </form>
      )}
    </FormProvider>
  )
}
