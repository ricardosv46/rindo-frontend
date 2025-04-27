import { useToggle } from '@hooks/useToggle'
import { UploadIcon } from '@icons/UploadIcon'
import { cn } from '@lib/utils'
import { useEffect, useState } from 'react'
import { Show } from '../Show/Show'
import { Spinner } from '../Spinner/Spinner'

interface IFileUpload {
  value?: string
}
export const FileUploadReadOnly = ({ value }: IFileUpload) => {
  const [isLoading, openLoading, closeLoading] = useToggle(true)
  const [filePreview, setFilePreview] = useState<string | undefined>(undefined)

  const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
    const response = await fetch(url)
    const data = await response.blob()
    return new File([data], filename, { type: mimeType })
  }

  useEffect(() => {
    loadFile()
  }, [])

  const loadFile = async () => {
    openLoading()
    const extension = value?.split('.').pop()?.toLowerCase()
    if (value && value?.length > 0 && ['png', 'jpg', 'jpeg', 'pdf'].includes(extension || '') && value.startsWith('https:')) {
      await handleConvertUrlToFile(value)
    } else {
      setFilePreview(value)
    }
    closeLoading()
  }

  const handleConvertUrlToFile = async (url: string) => {
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
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div
      className={cn(
        'relative flex mt-5  items-center justify-center w-full px-2 pt-2 pb-2 border border-dashed rounded-sm h-[634px] ',
        'border-primary-600'
      )}>
      <Show condition={isLoading} loadingComponent={<Spinner />}>
        {!value && !isLoading && (
          <div
            className={cn(
              'bg-gray-light  text-primary-600 text-center w-full h-full  py-[11px] px-9 rounded-[10px] flex flex-col justify-center items-center gap-5',
              'text-error'
            )}>
            <UploadIcon error={true} />
            No se han cargado documentos
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
      </Show>
    </div>
  )
}
