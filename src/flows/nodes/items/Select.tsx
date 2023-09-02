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
  defaultValue: string
  onSelect?: (value: string) => void
} & SelectProps
export const Select = (props: Props) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [value, setValue] = React.useState(props.defaultValue ?? '')

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string)
    props.onSelect && props.onSelect(event.target.value as string)
  }

  React.useEffect(() => {
    if (!ref.current) {
      return
    }
    props.onSelect && props.onSelect(props.defaultValue)
  }, [ref.current])

  return (
    <Box className="node-item" ref={ref}>
      <FormControl fullWidth>
        <InputLabel id="select-label">{props.label}</InputLabel>
        <MuiSelect
          labelId="select-label"
          id="demo-simple-select"
          value={value}
          label={props.label}
          className="nodrag"
          onChange={handleChange}
          size="small"
        >
          {props.children}
        </MuiSelect>
      </FormControl>
    </Box>
  )
}
