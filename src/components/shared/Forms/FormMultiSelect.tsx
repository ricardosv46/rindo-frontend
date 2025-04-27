import { Control, Controller } from 'react-hook-form'
import { SelectMultiple, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/selectmultiple'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface Option {
  value: string
  label: string
}

interface FormMultiSelectProps {
  name: string
  control: Control<any>
  options: Option[]
  placeholder?: string
  className?: string
  size?: 'default' | 'sm' | 'lg'
  label?: string
  disabled?: boolean
  exceptions?: string[]
  disabledOptionsExceptions?: boolean
}

export function FormMultiSelect({
  name,
  control,
  options,
  placeholder,
  className,
  size = 'default',
  label,
  disabled,
  exceptions,
  disabledOptionsExceptions
}: FormMultiSelectProps) {
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    default: 'h-9 px-3',
    lg: 'h-10 px-4 text-lg'
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Ensure field.value is always an array
        const values = Array.isArray(field.value) ? field.value : field.value ? [field.value] : []

        // Get selected options to display
        const selectedOptions = options.filter((option) => values.includes(option.value))

        // Handle adding a value
        const handleValueChange = (selectedValues: string[]) => {
          field.onChange(selectedValues)
        }

        // Handle removing a value
        const handleRemoveValue = (valueToRemove: string) => {
          console.log('valueToRemove', valueToRemove)
          const newValues = values.filter((value) => value !== valueToRemove)
          field.onChange(newValues)
          handleValueChange(newValues)
        }

        return (
          <div className="space-y-1">
            {label && <label className="text-sm font-medium">{label}</label>}
            <div className="relative">
              {/* Select dropdown */}
              <SelectMultiple disabled={disabled} onValueChange={handleValueChange} value={values}>
                <SelectTrigger
                  className={cn(
                    'border-input bg-background',
                    'flex w-full items-center justify-between rounded-md border px-3 py-1 text-base transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600 focus-visible:ring-offset-0 hover:border-primary-600/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    'data-[state=open]:border-primary-600 data-[state=open]:ring-1 data-[state=open]:ring-primary-600',
                    'data-[placeholder]:text-muted-foreground',
                    'focus:ring-0 focus:ring-offset-0 focus:border-primary-600',
                    error && 'border-red-600 focus-visible:ring-red-600 hover:border-red-600/50',
                    sizeClasses[size],
                    className
                  )}>
                  <div className="flex items-start flex-1 pointer-events-none">
                    {values.length === 0 ? (
                      <span className="text-left text-muted-foreground">{placeholder || 'Seleccionar opciones...'}</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {selectedOptions.map((option) => (
                          <Badge key={option?.value} variant="outline" className="bg-primary-600/10 text-primary-600 border-primary-600">
                            {option?.label}
                            <button
                              type="button"
                              className="ml-1 rounded-full outline-none pointer-events-auto bg- focus:ring-2 focus:ring-primary-500 "
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                handleRemoveValue(option?.value)
                              }}>
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent className="border-primary-600/20 z-[9999]">
                  {options?.map((option) => {
                    const isSelected = values.includes(option.value)
                    return (
                      <SelectItem
                        key={option?.value}
                        value={option?.value}
                        isSelected={isSelected}
                        disabled={disabledOptionsExceptions && !exceptions?.includes(option?.value)}
                        className={cn(
                          'relative cursor-pointer flex w-full select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none',
                          'focus:bg-primary-600/10 focus:text-primary-600',
                          isSelected ? 'bg-primary-600 text-white focus:bg-primary-600 focus:text-white' : '',
                          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        )}
                        onSelect={(e) => {
                          e.preventDefault()
                          handleValueChange(isSelected ? values.filter((v) => v !== option.value) : [...values, option.value])
                        }}>
                        {option.label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </SelectMultiple>
            </div>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
        )
      }}
    />
  )
}
