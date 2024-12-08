import React from 'react'
import { Controller, FieldErrors, Control } from 'react-hook-form'
import { FormControl, TextField, TextFieldProps } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, DatePickerFieldProps, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import dayjs, { Dayjs } from 'dayjs'

interface InputPickerProps {
  name: string
  control?: Control<any>
  errors?: FieldErrors
  minDate?: Dayjs
  size?: 'small' | 'medium'
  label?: string
  format?: string
}

export const InputPicker: React.FC<InputPickerProps> = ({
  name,
  control,
  errors,
  minDate,
  size = 'small',
  label,
  format = 'DD/MM/YYYY'
}) => {
  const helperText = errors?.[name]?.message as string
  return (
    <>
      <FormControl sx={{ minWidth: 120 }} error={!!errors?.[name]}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                sx={{
                  marginTop: -1
                }}
                components={['DatePicker']}>
                <DatePicker
                  {...field}
                  className="w-full"
                  maxDate={dayjs()}
                  {...(minDate ? minDate : {})}
                  label={label}
                  value={field?.value ? dayjs(field?.value) : null}
                  onChange={(newValue) => field.onChange(newValue?.format(format))}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size,
                      error: !!errors?.[name],
                      helperText
                    }
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          )}
        />
      </FormControl>
    </>
  )
}
