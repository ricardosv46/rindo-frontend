import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ROLES = {
  ADMIN: 'ADMIN',
  CORPORATION: 'COPORATIVO',
  SUBMITTER: 'RENDIDOR',
  APPROVER: 'APROBADOR',
  GLOBAL_APPROVER: 'APROBADOR GLOBAL'
}

export const downloadFile = (blob: Blob, name: string) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const onlyNumbers = (text: string): string => {
  return text.replace(/\D+/g, '')
}
export const formatNumberInline = (input: string): string => {
  input = input.replace(/[^0-9.]/g, '')
  const firstDotIndex = input.indexOf('.')
  let integerPart: string
  let decimalPart: string | undefined
  if (firstDotIndex !== -1) {
    integerPart = input.slice(0, firstDotIndex)
    decimalPart = input.slice(firstDotIndex + 1).replace(/\./g, '')
  } else {
    integerPart = input
    decimalPart = undefined
  }
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formattedDecimalPart = decimalPart ? decimalPart.slice(0, 2) : ''
  const endsWithDot = input.endsWith('.')
  if (endsWithDot) {
    return `${formattedIntegerPart}.`
  }
  if (decimalPart !== undefined) {
    return formattedDecimalPart ? `${formattedIntegerPart}.${formattedDecimalPart}` : formattedIntegerPart
  }
  return formattedIntegerPart
}

export const formatNumber = (input: string): string => {
  return Number(input.replaceAll(',', '') ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
}

export const valuesFormData = <T>(data: T) => {
  const formData = new FormData()

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (key.includes('Preview')) return

      if (value instanceof File) {
        formData.append(key, value)
      } else if (Array.isArray(value) && value.every((item) => item instanceof File)) {
        value.forEach((file) => formData.append(key, file))
      } else {
        formData.append(key, String(value))
      }
    })

    return formData
  }

  return null
}
