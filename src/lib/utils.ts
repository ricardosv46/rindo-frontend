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
