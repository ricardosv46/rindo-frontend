import { FileUpload } from '@components/shared'
import { ReadOnlyField } from '@components/shared/ReadOnlyField/ReadOnlyField'
import { Category, Currency, TypeDocument } from '@interfaces/expense'
import { cn, formatNumber } from '@lib/utils'
import { HtmlHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

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
interface IFormShowExpense extends HtmlHTMLAttributes<HTMLDivElement> {}
export const FormShowExpense = ({ className }: IFormShowExpense) => {
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
  const {
    typeDocument,
    category,
    ruc,
    total,
    retention,
    file,
    filePreview,
    fileVisaPreview,
    fileVisa,
    fileRxhPreview,
    fileRxh,
    loadedFile,
    companyName,
    description,
    date,
    currency,
    serie
  } = watch()

  const showSerie = typeDocument === 'BOLETA DE VENTA' || typeDocument === 'FACTURA ELECTRONICA'

  return (
    <div className={cn('relative space-y-4 ', className)}>
      <section className="grid grid-cols-2">
        <div className="flex items-start justify-center">
          <div className="grid w-full grid-cols-2 gap-3">
            <ReadOnlyField label="Ruc" value={ruc} />

            <ReadOnlyField label="Razon Social" value={companyName} />

            <ReadOnlyField label="Descripción" value={description} className="col-span-2" />

            <ReadOnlyField label="Categoría" value={category} />

            <ReadOnlyField label="Fecha de Emisión" value={date} />

            <ReadOnlyField label="Total" value={formatNumber(String(total))} />

            <ReadOnlyField label="Moneda" value={currency} />

            <ReadOnlyField label="Documento" value={typeDocument} />

            <ReadOnlyField label="Serie" value={serie} />
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-5 px-5 ">
          <FileUpload
            control={control}
            label="Comprobante"
            name="filePreview"
            value={filePreview}
            file={file}
            onFileChange={() => {}}
            disabledClose
          />

          <FileUpload
            control={control}
            label="Estado de cuenta visa"
            name="fileVisaPreview"
            value={fileVisaPreview}
            file={fileVisa}
            onFileChange={() => {}}
            disabledClose
          />
          {((total && Number(total || 0) >= 1500 && retention === 0) || fileRxhPreview) && (
            <FileUpload
              control={control}
              label="Suspención de 4ta categoría"
              name="fileRxhPreview"
              value={fileRxhPreview}
              file={fileRxh}
              onFileChange={() => {}}
              disabledClose
            />
          )}
        </div>
      </section>
    </div>
  )
}
