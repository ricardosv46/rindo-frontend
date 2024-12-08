import React from 'react'
import { Controller, FieldErrors, Control } from 'react-hook-form'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps } from '@mui/material'

interface ISelectProps extends Omit<SelectProps, 'name'> {
  name: string
  control: Control<any>
  errors?: FieldErrors
  maxLength?: number
  formatText?: (value: string) => string
  data: { value: string; label: string }[]
  size?: 'small' | 'medium'
}

export const InputSelect = ({
  name,
  control,
  errors,
  maxLength,
  formatText,
  data,
  className,
  size = 'small',
  ...selectProps
}: ISelectProps) => {
  const helperText = errors?.[name]?.message as string
  return (
    <FormControl sx={{ minWidth: 120 }} size={size} className={`${className} w-full`} error={!!errors?.[name]}>
      <InputLabel id={`select-${name}-label`}>{selectProps.label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            {...selectProps}
            labelId={`select-${name}-label`}
            id={`select-${name}`}
            MenuProps={{
              disablePortal: true
            }}>
            {data.map((i, index) => (
              <MenuItem key={index} value={i.value}>
                {i.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors?.[name] && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
