'use client'

import * as React from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
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
}

export function FormDatePickerWithRange({ className, control, name }: DatePickerWithRangeProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-[220px] justify-start text-left font-normal text-black',
                  !field.value && 'text-muted-foreground',
                  'border-input bg-background',
                  'flex items-center justify-between rounded-md border  px-3 py-1 text-base transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-600 focus-visible:ring-offset-0 hover:border-primary-600/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                  'data-[state=open]:border-primary-600 data-[state=open]:ring-1 data-[state=open]:ring-primary-600',
                  'data-[placeholder]:text-muted-foreground',
                  'focus:ring-0 focus:ring-offset-0 focus:border-primary-600'
                )}>
                {field.value?.from ? (
                  field.value.to ? (
                    <>
                      {dayjs(field.value.from).format('DD MMM, YYYY')} - {dayjs(field.value.to).format('DD MMM, YYYY')}
                    </>
                  ) : (
                    dayjs(field.value.from).format('DD MMM, YYYY')
                  )
                ) : (
                  <span>Seleccionar fecha</span>
                )}
                <CalendarIcon className="w-4 h-4 mr-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={field.value?.from}
                selected={field.value}
                onSelect={field.onChange}
                numberOfMonths={2}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  )
}
