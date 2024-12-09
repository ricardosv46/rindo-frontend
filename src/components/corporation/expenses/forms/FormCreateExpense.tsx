import { FileUpload, InputSelect, InputText } from '@components/shared'
import { InputPicker } from '@components/shared/Inputs/InputPicker'
import { categories } from '@constants/categories'
import { currencies } from '@constants/currencies'
import { typeDocuments } from '@constants/typeDocuments'
import { Category, Currency, TypeDocument } from '@interfaces/expense'
import { formatNumber, formatNumberInline, onlyNumbers } from '@lib/utils'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { z } from 'zod'

export type StepData = {
  ruc?: string
  companyName?: string
  description?: string
  file?: File
  filePreview?: string
  fileVisa?: File
  fileVisaPreview?: string
  fileRxh?: File
  fileRxhPreview?: string
  category?: Category
  total?: string
  currency?: Currency
  serie?: string
  rus?: boolean
  retention?: number
  date?: string
  typeDocument?: TypeDocument
}

export const stepSchemaCreateSpend = z
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
    rus: z.boolean().optional(),
    retention: z.number().optional(),
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
  .refine(
    (data) => {
      const total = Number(data?.total || 0)
      return !(total >= 1500 && data?.retention === 0)
    },
    {
      message: 'Si el total es mayor a 1500 y la retencion es 0 debe adjuntar una suspeción.',
      path: ['fileRxhPreview']
    }
  )

interface IFormCreateExpense {
  index: number
  multiple?: boolean
}

export const FormCreateExpense = ({ index, multiple }: IFormCreateExpense) => {
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
  const { typeDocument, category, total, retention } = watch()

  const showSerie = typeDocument === 'BOLETA DE VENTA' || typeDocument === 'FACTURA ELECTRONICA'

  useEffect(() => {
    if (watch().typeDocument === 'BOLETA DE VENTA' && watch().rus && category !== 'Cuenta no deducible') {
      setValue('category', '')
    }
  }, [typeDocument])

  return (
    <div className="space-y-4">
      {multiple && <h2 className="text-2xl font-bold">Step {index + 1}</h2>}
      <section className="grid grid-cols-2">
        <div className="flex items-start justify-center">
          <div className="grid w-full grid-cols-2 gap-5">
            <InputText control={control} name="ruc" errors={errors} label="Ruc" maxLength={11} formatText={onlyNumbers} />

            <InputText control={control} name="companyName" errors={errors} label="Razon Social" />

            <InputText control={control} name="description" errors={errors} label="Descripción" className="col-span-2" />

            <InputSelect
              control={control}
              name="category"
              errors={errors}
              label="Categoría"
              data={categories}
              disabled={watch().typeDocument === 'BOLETA DE VENTA' && watch().rus}
              exceptions={['Cuenta no deducible']}
            />

            <InputPicker control={control} name="date" errors={errors} label="Fecha de Emisión" />

            <InputText
              control={control}
              name="total"
              errors={errors}
              label="Total"
              formatText={formatNumberInline}
              formatTextLeave={formatNumber}
            />

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
                label="Comprobante"
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
                label="Estado de cuenta visa"
                name="fileVisaPreview"
                value={watch().fileVisaPreview}
                file={watch().fileVisa}
                onFileChange={handleFileChangeVisa}
                errors={errors}
              />
            )}
          />
          {total && Number(total || 0) >= 1500 && retention === 0 && (
            <Controller
              name="fileRxhPreview"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Suspención de 4ta categoría"
                  name="fileRxhPreview"
                  value={watch().fileRxhPreview}
                  file={watch().fileRxh}
                  onFileChange={handleFileChangeRxh}
                  errors={errors}
                />
              )}
            />
          )}
        </div>
      </section>
    </div>
  )
}
