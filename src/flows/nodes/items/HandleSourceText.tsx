// @flow
import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'
type Props = {
  label: string
  handleId: string
  nodeId: string
}
const handleSize = 20
export const HandleSourceText = (props: Props) => {
  const ref = React.useRef<HTMLDivElement>(null)

  const updateNodeInternals = useUpdateNodeInternals()
  const [handlePositionTop, setHandlePositionTop] = React.useState(0)
  React.useEffect(() => {
    if (!ref.current) {
      return
    }
    setHandlePositionTop(ref.current.offsetTop + 28)
  }, [ref.current?.offsetTop])
  React.useEffect(() => {
    updateNodeInternals(props.nodeId)
  }, [handlePositionTop])

  return (
    <Box ref={ref} className="node-item">
      <Typography variant="h6">{props.label}</Typography>
      {handlePositionTop && (
        <Handle
          type="source"
          position={Position.Right}
          id={props.handleId}
          style={{
            background: 'lime',
            width: handleSize,
            height: handleSize,
            right: -handleSize / 2,
            top: handlePositionTop,
          }}
        />
      )}
    </Box>
  )
}
