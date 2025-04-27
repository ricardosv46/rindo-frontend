import { FileUpload, FormDatePicker, FormSelect } from '@components/shared'
import { FormInput } from '@components/shared/Forms/FormInput'
import { categories } from '@constants/categories'
import { currencies } from '@constants/currencies'
import { typeDocuments } from '@constants/typeDocuments'
import { Category, Currency, TypeDocument } from '@interfaces/expense'
import { cn, formatNumber, formatNumberInline, onlyNumbers } from '@lib/utils'
import dayjs from 'dayjs'
import { HtmlHTMLAttributes, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { z } from 'zod'

export type StepData = {
  loadedFile?: boolean
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
    category: z.string().min(1, 'La categoría es obligatoria.') as unknown as z.ZodType<Category>,
    total: z.string().min(1, 'El totaldata es obligatorio.'),
    currency: z.string().min(1, 'La moneda es obligatoria.') as unknown as z.ZodType<Currency>,
    serie: z.string().optional(),
    rus: z.boolean().optional(),
    retention: z.number().optional(),
    // date: z.string().min(1, 'La fecha de emisión es obligatoria.'),
    date: z
      .string()
      .min(1, 'La fecha de emisión es obligatoria')
      .refine((date) => !dayjs(date).isAfter(dayjs()), {
        message: 'La fecha no puede ser mayor a la fecha actual'
      }),
    typeDocument: z.string().min(1, 'El tipo de documento es obligatorio.') as unknown as z.ZodType<TypeDocument>,
    file: z.instanceof(File),
    filePreview: z.string().min(1, 'El archivo es obligatorio.'),
    fileVisa: z.instanceof(File).optional(),
    fileVisaPreview: z.string().optional(),
    fileRxh: z.instanceof(File).optional(),
    fileRxhPreview: z.string().optional(),
    loadedFile: z.boolean().optional()
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
      const isRetentionRequired = total >= 1500 && data?.retention === 0
      if (isRetentionRequired) {
        return data?.fileRxhPreview && data?.fileRxhPreview.trim() !== ''
      }
      return true
    },
    {
      message: 'Si el total es mayor o igual a 1500 y la retención es 0, debe adjuntar una suspensión.',
      path: ['fileRxhPreview']
    }
  )

interface IFormCreateExpense extends HtmlHTMLAttributes<HTMLDivElement> {
  index: number
  multiple?: boolean
  loading?: boolean
  getDataOcr?: (file: File) => void
}

export const FormCreateExpense = ({ index, multiple, loading, className, getDataOcr }: IFormCreateExpense) => {
  const {
    watch,
    getValues,
    register,
    setValue,
    control,
    clearErrors,
    reset,
    formState: { errors }
  } = useFormContext<StepData>()
  const { typeDocument, category, total, retention, file, filePreview, fileVisaPreview, fileVisa, fileRxhPreview, fileRxh, loadedFile } =
    watch()

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

  const showSerie = typeDocument === 'BOLETA DE VENTA' || typeDocument === 'FACTURA ELECTRONICA'

  useEffect(() => {
    if (typeDocument === 'BOLETA DE VENTA' && watch().rus && category !== 'Cuenta no deducible') {
      setValue('category', '')
    }
  }, [typeDocument])

  return (
    <div className={cn('relative space-y-4 ', loading && 'opacity-50', className)}>
      {multiple && <h2 className="text-2xl font-bold">Step {index + 1}</h2>}
      <section className="grid grid-cols-2">
        <div className="flex items-start justify-center">
          <div className="grid w-full grid-cols-2 gap-5">
            <FormInput control={control} name="ruc" label="Ruc" maxLength={11} formatText={onlyNumbers} />

            <FormInput control={control} name="companyName" label="Razon Social" />

            <FormInput control={control} name="description" label="Descripción" className="col-span-2" />

            <FormSelect
              control={control}
              name="category"
              placeholder="Selecciona una categoría"
              label="Categoría"
              options={categories}
              disabledOptionsExceptions={typeDocument === 'BOLETA DE VENTA' && watch().rus}
              exceptions={['Cuenta no deducible']}
            />

            <FormDatePicker control={control} name="date" label="Fecha de Emisión" />

            <FormInput control={control} name="total" label="Total" formatText={formatNumberInline} formatTextLeave={formatNumber} />

            <FormSelect control={control} name="currency" placeholder="Selecciona una moneda" label="Moneda" options={currencies} />

            <FormSelect
              control={control}
              name="typeDocument"
              placeholder="Selecciona un tipo de documento"
              label="Documento"
              options={typeDocuments}
            />

            {showSerie && <FormInput control={control} name="serie" label="Serie" />}
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-5 px-5 ">
          <FileUpload
            label="Comprobante"
            name="filePreview"
            control={control}
            value={filePreview}
            file={file}
            getDataOcr={getDataOcr}
            onFileChange={handleFileChange}
          />

          <FileUpload
            control={control}
            label="Estado de cuenta visa"
            name="fileVisaPreview"
            value={fileVisaPreview}
            file={fileVisa}
            onFileChange={handleFileChangeVisa}
          />

          {((total && Number(total || 0) >= 1500 && retention === 0) || fileRxhPreview) && (
            <FileUpload
              control={control}
              label="Suspención de 4ta categoría"
              name="fileRxhPreview"
              value={fileRxhPreview}
              file={fileRxh}
              onFileChange={handleFileChangeRxh}
            />
          )}
        </div>
      </section>
    </div>
  )
}
