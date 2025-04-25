import { cn } from '@/lib/utils'

interface DividerProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'dashed'
}

export function Divider({ className, orientation = 'horizontal', variant = 'default' }: DividerProps) {
  return (
    <div
      className={cn(
        'border-t border-gray-200',
        orientation === 'vertical' && 'border-l h-full w-px',
        variant === 'dashed' && 'border-dashed',
        className
      )}
    />
  )
}
