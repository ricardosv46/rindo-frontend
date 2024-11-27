import { cn } from '@/lib/utils'
import React, { ButtonHTMLAttributes } from 'react'
interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  color: 'green' | 'red' | 'purple' | 'gray' | 'yellow' | 'blue'
  button?: boolean
}
export const Chip = ({ label, color, className, button, ...props }: ChipProps) => {
  const getColor = () => {
    if (color === 'green') return 'bg-green-300 text-green-600'
    if (color === 'red') return 'bg-red-300 text-red-600'
    if (color === 'purple') return ' bg-purple-300 text-purple-600'
    if (color === 'gray') return ' bg-gray-300 text-gray-600'
    if (color === 'yellow') return ' bg-yellow-300 text-yellow-600'
    if (color === 'blue') return ' bg-blue-300 text-blue-600'
  }

  return button ? (
    <button
      className={cn(getColor(), 'rounded-xl  flex justify-center items-center px-2 py-0.5 text-sm w-auto self-start', className)}
      {...props}>
      {label}
    </button>
  ) : (
    <button
      className={cn(
        getColor(),
        ' pointer-events-none rounded-xl  flex justify-center items-center px-2 py-0.5 text-sm w-auto self-start',
        className
      )}>
      {label}
    </button>
  )
}
