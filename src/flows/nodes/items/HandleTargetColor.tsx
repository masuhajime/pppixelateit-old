// @flow
import { Box, Button, Popover } from '@mui/material'
import { Chrome, rgbaToHexa } from '@uiw/react-color'
import * as React from 'react'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'
import { RGBA } from '../../../dto/generals'
type Props = {
  handleId: string
  nodeId: string
  //colorHexaString?: string
  color?: RGBA
  onChange?: (color: RGBA) => void
}
const handleSize = 20
export const HandleTargetColor = (props: Props) => {
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
  const color = props.color || { r: 255, g: 255, b: 255, a: 1 }
  const colorHexa = rgbaToHexa(color)

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <Box ref={ref} className="node-item">
      <Button
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
        sx={{
          width: '100%',
          fontSize: '0.6rem',
          background: colorHexa,
        }}
        className="nodrag"
      >
        {colorHexa} ({color?.r}, {color?.g}, {color?.b},{' '}
        {Math.floor(color?.a * 100)})
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        className="nodrag"
      >
        <Chrome
          color={colorHexa}
          onChange={(color) => {
            if (props.onChange) {
              props.onChange(color.rgba)
            }
          }}
        />
      </Popover>
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
