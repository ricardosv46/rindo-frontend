import { StepData, FormCreateExpense, stepSchemaCreateSpend } from '@components/corporation/expenses/forms/FormCreateExpense'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export const MultipleStep = () => {
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
    resolver: zodResolver(stepSchemaCreateSpend),
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
    const isStepValid = await trigger()

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
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={handlePrevious} disabled={currentStep === 0}>
            Anterior
          </Button>
          {currentStep < numSteps - 1 ? (
            <Button type="button" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button type="submit">Crear Gastos</Button>
          )}
        </div>
        <FormCreateExpense index={currentStep} multiple />
      </form>
    </FormProvider>
  )
}
