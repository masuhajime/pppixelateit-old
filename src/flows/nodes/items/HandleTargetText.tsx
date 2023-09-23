// @flow
import { Box, TextField } from '@mui/material'
import * as React from 'react'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'
type Props = {
  name: string
  handleId: string
  nodeId: string
  defaultValue: string
  onChange?: (value: string) => void
  disableInput?: boolean
}
const handleSize = 20
export const HandleTargetText = (props: Props) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const updateNodeInternals = useUpdateNodeInternals()
  const [handlePositionTop, setHandlePositionTop] = React.useState(0)
  React.useEffect(() => {
    const offset = !ref.current?.offsetTop ? 0 : ref.current.offsetTop
    props.onChange && props.onChange(props.defaultValue)
    setHandlePositionTop(offset + 28)
  }, [ref.current?.offsetTop])
  React.useEffect(() => {
    updateNodeInternals(props.nodeId)
  }, [handlePositionTop])

  return (
    <Box className="node-item" ref={ref}>
      <TextField
        label={props.name}
        type="text"
        InputLabelProps={{
          shrink: true,
        }}
        defaultValue={props.defaultValue}
        variant="outlined"
        className="nodrag"
        size="small"
        sx={{ width: '100%' }}
        onChange={(e) => {
          props.onChange && props.onChange(e.target.value || '')
        }}
        disabled={props.disableInput}
      />
      {handlePositionTop && (
        <Handle
          type="target"
          position={Position.Left}
          id={props.handleId}
          style={{
            background: 'lime',
            width: handleSize,
            height: handleSize,
            left: -handleSize / 2,
            top: handlePositionTop,
          }}
        />
      )}
    </Box>
  )
}
