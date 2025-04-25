import { Input } from '@/components/ui/input'
import { Control, Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface FormInputProps {
  name: string
  control: Control<any>
  placeholder?: string
  label?: string
  className?: string
  formatText?: (value: string) => string
  formatTextLeave?: (value: string) => string
  maxLength?: number
}

export function FormInput({
  name,
  control,
  placeholder = 'Buscar',
  label,
  className,
  formatText,
  formatTextLeave,
  maxLength
}: FormInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-1">
          {label && <label className="text-sm font-medium">{label}</label>}
          <Input
            {...field}
            onChange={(e) => (formatText ? field.onChange(formatText(e.target.value)) : field.onChange(e))}
            onBlur={(e) => (formatTextLeave ? field.onChange(formatTextLeave(e.target.value)) : field.onChange(e))}
            maxLength={maxLength}
            placeholder={placeholder}
            className={cn(
              'border-input bg-background',
              'focus-visible:ring-1 focus-visible:ring-primary-600 focus-visible:ring-offset-0',
              'hover:border-primary-600/50',
              error && 'border-red-600 focus-visible:ring-red-600 hover:border-red-600/50',
              className
            )}
          />
          {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
      )}
    />
  )
}
