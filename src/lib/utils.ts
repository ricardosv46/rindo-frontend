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
  return text.replace(/\D+/g, '') // Reemplaza todo lo que no sea un dígito por una cadena vacía.
}
