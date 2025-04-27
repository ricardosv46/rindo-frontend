import { Input } from '@/components/ui/input'
import { Control, Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { useToggle } from '@hooks/useToggle'
import { Button } from '@components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

interface FormInputProps {
  name: string
  control: Control<any>
  placeholder?: string
  label?: string
  className?: string
  formatText?: (value: string) => string
  formatTextLeave?: (value: string) => string
  maxLength?: number
  type?: 'text' | 'password'
}

export function FormInput({
  name,
  control,
  placeholder = 'Buscar',
  label,
  className,
  formatText,
  formatTextLeave,
  maxLength,
  type = 'text'
}: FormInputProps) {
  const [isOpenPassword, , , togglePassword] = useToggle()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="relative space-y-1">
          {label && <label className="text-sm font-medium">{label}</label>}
          <Input
            {...field}
            type={type === 'password' && isOpenPassword ? 'text' : type}
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
          {type === 'password' && (
            <Button type="button" variant="ghost" size="icon" className="absolute rounded-full right-1 top-6" onClick={togglePassword}>
              {!isOpenPassword && <Eye className="text-primary-600" />}
              {isOpenPassword && <EyeOff className="text-primary-600" />}
            </Button>
          )}
          {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
      )}
    />
  )
}
