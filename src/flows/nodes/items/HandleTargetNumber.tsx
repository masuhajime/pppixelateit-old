// @flow
import { Box, TextField } from '@mui/material'
import * as React from 'react'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'
type Props = {
  name: string
  handleId: string
  nodeId: string
  defaultValue: number
  onChange?: (value: number) => void
}
const handleSize = 20
export const HandleTargetNumber = (props: Props) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const updateNodeInternals = useUpdateNodeInternals()
  const [handlePositionTop, setHandlePositionTop] = React.useState(0)
  React.useEffect(() => {
    if (!ref.current) {
      return
    }
    props.onChange && props.onChange(props.defaultValue)
    setHandlePositionTop(ref.current.offsetTop + 28)
  }, [ref.current?.offsetTop])
  React.useEffect(() => {
    updateNodeInternals(props.nodeId)
  }, [handlePositionTop])

  return (
    <Box className="node-item" ref={ref}>
      <TextField
        id="outlined-number"
        label={props.name}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        defaultValue={props.defaultValue}
        variant="outlined"
        className="nodrag"
        size="small"
        onChange={(e) => {
          props.onChange &&
            parseInt(e.target.value) &&
            props.onChange(parseInt(e.target.value))
        }}
      />
      {handlePositionTop && (
        <Handle
          type="target"
          position={Position.Left}
          id={props.handleId}
          style={{
            background: 'OrangeRed',
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
