import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export const IconButtonPurple = ({ children, className, ...props }: IconButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        'flex items-center justify-center w-[34px] h-[34px] transition-all duration-300 ease-in-out rounded-lg bg-primary-300 text-primary-600 hover:text-primary-300 hover:bg-primary-600',
        className
      )}>
      {children}
    </button>
  )
}
