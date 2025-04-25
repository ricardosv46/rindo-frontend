import { UploadIcon } from '@icons/UploadIcon'
import { cn } from '@lib/utils'
import { FormControl, FormHelperText } from '@mui/material'
import { IconEye } from '@tabler/icons-react'
import { CircleX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FieldErrors } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Modal } from '../Modal/Modal'
import { Card } from '../Card/Card'
import { FileUploadReadOnly } from './FileUploadReadOnly'
import { useToggle } from '@hooks/useToggle'

interface IFileUpload {
  name: string
  label: string
  file?: File
  value?: string
  onFileChange: (file: File | undefined, preview: string) => void
  errors?: FieldErrors
  getDataOcr?: (file: File) => void
  disabledClose?: boolean
}
export const FileUpload = ({ name, onFileChange, value, file, label, errors, getDataOcr, disabledClose = false }: IFileUpload) => {
  const [isOpenModalFile, openModalFile, closeModalFile] = useToggle()
  const [filePreview, setFilePreview] = useState<string | undefined>(undefined)
  const helperText = errors?.[name]?.message as string
  const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
    const response = await fetch(url)
    const data = await response.blob()
    return new File([data], filename, { type: mimeType })
  }

  useEffect(() => {
    if (value === '') {
      setFilePreview('')
      onFileChange(undefined, '')
      return
    }
    const extension = value?.split('.').pop()?.toLowerCase()
    if (value && value?.length > 0 && ['png', 'jpg', 'jpeg', 'pdf'].includes(extension || '')) {
      handleConvertUrlToFile(value)
      return
    }

    if (file) convertFiletoUrl(file)
  }, [file])

  const handleConvertUrlToFile = async (url: string) => {
    console.log({ url })
    const extension = url.split('.').pop()?.toLowerCase()
    let mimeType = ''
    let filename = ''
    {
    }
    if (extension === 'pdf') {
      mimeType = 'application/pdf'
      filename = 'document.pdf'
    } else if (['png', 'jpg', 'jpeg'].includes(extension || '')) {
      mimeType = `image/${extension === 'jpg' ? 'jpeg' : extension}`
      filename = `image.${extension}`
    } else {
      if (file) {
        convertFiletoUrl(file)
      }

      return
      // console.error('Tipo de archivo no soportado')
    }

    try {
      const file = await urlToFile(url, filename, mimeType)
      convertFiletoUrl(file)
    } catch (error) {
      console.error('Error al convertir la URL a archivo:', error)
    }
  }

  const convertFiletoUrl = (file: File) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const preview = reader.result as string
        setFilePreview(preview)
        onFileChange(file, preview)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,application/pdf'
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (getDataOcr) {
        getDataOcr(file)
      }
      convertFiletoUrl(file)
    }

    input.click()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const files = e.dataTransfer.files

    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf']
    const file = files[0]
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    const isValidExtension = allowedExtensions.includes(`.${fileExtension}`)

    if (isValidExtension) {
      if (getDataOcr) {
        getDataOcr(file)
      }
      convertFiletoUrl(file)
    } else {
      toast.error('Formato no valido')
    }
  }

  const handleRemoveFile = () => {
    setFilePreview(undefined)
    onFileChange(undefined, '')
  }

  return (
    <FormControl sx={{ minWidth: 120 }} error={!!errors?.[name]}>
      <p className={cn(!!errors?.[name] ? 'text-red-600' : '')}>{label}</p>
      <div
        className={cn(
          'relative flex items-center justify-center w-full px-2 pt-2 pb-2 border border-dashed rounded-sm h-[250px] ',
          !!errors?.[name] ? 'border-red-600' : 'border-primary-600'
        )}>
        {!filePreview && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onClick={handleFileChange}
            className={cn(
              'bg-gray-light hover:cursor-pointer text-primary-600 text-center w-full h-full  py-[11px] px-9 rounded-[10px] hover:opacity-50 ease-in-out duration-100 transition-all flex flex-col justify-center items-center gap-5',
              !!errors?.[name] ? 'text-red-600' : 'text-primary-600'
            )}>
            <UploadIcon error={!!errors?.[name]} />
            Arrastra o selecciona un archivo de tu ordenador
          </div>
        )}
        {filePreview && !filePreview.includes('application/pdf') && (
          <img src={filePreview} alt="Preview" className="object-contain w-full h-full " />
        )}

        {filePreview && filePreview.includes('application/pdf') && (
          <embed
            type="application/pdf"
            src={filePreview}
            className="object-contain w-full h-full "
            onLoad={() => {
              URL.revokeObjectURL(filePreview!)
            }}
          />
        )}
        {filePreview && !disabledClose && (
          <button className="absolute top-1 right-1 " onClick={handleRemoveFile}>
            <CircleX className="p-0.5 text-white bg-red-600 rounded-full" />
          </button>
        )}

        {filePreview && (
          <button className="absolute rounded-full bg-primary-600 top-1 left-1" type="button" onClick={openModalFile}>
            <IconEye className="p-0.5 text-white" />
          </button>
        )}
      </div>

      <Modal isOpen={isOpenModalFile} onClose={closeModalFile}>
        <Card className="w-[500px] max-h-[95vh] overflow-hidden">
          <FileUploadReadOnly value={filePreview} />
        </Card>
      </Modal>
      {errors?.[name] && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
