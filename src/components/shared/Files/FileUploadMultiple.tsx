import { DocumentIcon } from '@icons/DocumentIcon'
import { UploadIcon } from '@icons/UploadIcon'
import { cn } from '@lib/utils'
import { CircleX } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
interface FileUploadMultiple {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
}
export const FileUploadMultiple = ({ files, setFiles }: FileUploadMultiple) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }

  const handleFileChange = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,application/pdf'
    input.multiple = true
    input.onchange = (e: any) => {
      const data = e.target.files
      addFiles(Array.from(data))
    }
    input.click()
  }

  const addFiles = (newFiles: File[]) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf']

    const validFiles = newFiles.filter((file) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const isValidExtension = allowedExtensions.includes(`.${fileExtension}`)

      if (!isValidExtension) {
        toast.error(`Formato no válido: ${file.name}`)
        return false
      }

      const isDuplicate = files.some((existingFile) => existingFile.name === file.name)
      if (isDuplicate) {
        toast.warn(`El archivo ya existe: ${file.name}`)
        return false
      }

      return true
    })

    setFiles((prevFiles) => [...prevFiles, ...validFiles])
  }

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }

  return (
    <div>
      <div className={cn('relative w-full px-2 pt-2 pb-2 border border-dashed rounded-sm h-[250px] border-primary-600')}>
        <div
          className={cn(
            'bg-gray-light hover:cursor-pointer text-center w-full h-full py-[11px] px-9 rounded-[10px] hover:opacity-50 ease-in-out duration-100 transition-all flex flex-col justify-center items-center gap-5 text-primary-600'
          )}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          onClick={handleFileChange}>
          <UploadIcon />
          Arrastra o selecciona un archivo de tu ordenador
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-2 mt-5">
          {files.map((file) => (
            <div key={file.name} className="flex items-center gap-2 px-3 py-2 text-sm border border-primary-600 rounded-xl">
              <DocumentIcon className="w-[30px] h-[30px] text-primary-600" />
              <div className="flex-1">
                <p>{file.name}</p>
                <p className="text-primary-300">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button onClick={() => removeFile(file.name)} className="p-1">
                <CircleX className="text-red-600 hover:text-red-800" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
