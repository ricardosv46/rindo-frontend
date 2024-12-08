import React from 'react'
import { Controller, FieldErrors, Control } from 'react-hook-form'
import { TextField, TextFieldProps } from '@mui/material'

interface InputTextProps extends Omit<TextFieldProps, 'name'> {
  name: string
  control: Control<any>
  errors?: FieldErrors
  maxLength?: number
  formatText?: (value: string) => string
}

export const InputText: React.FC<InputTextProps> = ({ name, control, errors, maxLength, formatText, ...textFieldProps }) => {
  const helperText = errors?.[name]?.message as string
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...textFieldProps}
          onChange={(e) => (formatText ? field.onChange(formatText(e.target.value)) : field.onChange(e))}
          className={`${textFieldProps.className} w-full`}
          type="text"
          color="primary"
          size={textFieldProps?.size || 'small'}
          error={!!errors?.[name]}
          helperText={helperText}
          slotProps={{
            ...textFieldProps.slotProps,
            htmlInput: { ...textFieldProps.slotProps?.htmlInput, ...(maxLength ? { maxLength } : {}) }
          }}
        />
      )}
    />
  )
}
