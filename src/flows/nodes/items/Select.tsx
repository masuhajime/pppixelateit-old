// @flow
import {
  Box,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material'
import React from 'react'
type Props = {
  label: string
  nodeId: string
  children: React.ReactNode
  defaultValue?: string
  onChange?: (value: string) => void
} & SelectProps
export const Select = (props: Props) => {
  const [value, setValue] = React.useState(props.defaultValue ?? '')

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string)
    props.onChange && props.onChange(event.target.value as string)
  }
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="select-label">{props.label}</InputLabel>
        <MuiSelect
          labelId="select-label"
          id="demo-simple-select"
          value={value}
          label={props.label}
          className="nodrag"
          onChange={handleChange}
        >
          {props.children}
        </MuiSelect>
      </FormControl>
    </Box>
  )
}
