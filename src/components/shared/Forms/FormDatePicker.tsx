'use client'

import * as React from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { CalendarIcon } from 'lucide-react'
import { es } from 'date-fns/locale'
import { Control, Controller } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

dayjs.locale('es')

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  control: Control<any>
  name: string
  label?: string
}

export function FormDatePicker({ className, control, name, label }: DatePickerWithRangeProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn('grid gap-2', className)}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="space-y-1">
                {label && <label className="text-sm font-medium">{label}</label>}
                <Button
                  type="button"
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal text-black',
                    !field.value && 'text-muted-foreground',
                    'border-input bg-background',
                    'flex w-full items-center justify-between rounded-md border  px-3 py-1 text-base transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600 focus-visible:ring-offset-0 hover:border-primary-600/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    'data-[state=open]:border-primary-600 data-[state=open]:ring-1 data-[state=open]:ring-primary-600',
                    'data-[placeholder]:text-muted-foreground',
                    'focus:ring-0 focus:ring-offset-0 focus:border-primary-600',
                    error && 'border-red-600 focus-visible:ring-red-600 hover:border-red-600/50'
                  )}>
                  {field.value ? dayjs(field.value).format('DD MMM, YYYY') : <span>Seleccionar fecha</span>}
                  <CalendarIcon className="w-4 h-4 mr-2" />
                </Button>
                {error && <p className="text-sm text-red-500">{error.message}</p>}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="single"
                defaultMonth={field.value}
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date)
                  setOpen(false)
                }}
                numberOfMonths={1}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  )
}
