import { SearchIcon } from 'lucide-react'
import { Control, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { cn } from '@lib/utils'

interface FormSearchInputProps {
  name: string
  control: Control<any>
  placeholder?: string
  className?: string
}

export function FormSearchInput({ name, control, placeholder = 'Buscar', className }: FormSearchInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            {...field}
            placeholder={placeholder}
            className={cn(
              'pl-8',
              'border-input bg-background',
              'focus-visible:ring-1 focus-visible:ring-primary-600 focus-visible:ring-offset-0',
              'hover:border-primary-600/50',
              className
            )}
          />
        </div>
      )}
    />
  )
}
