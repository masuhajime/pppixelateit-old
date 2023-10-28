// @flow
import { Box, Button, Popover, Typography } from '@mui/material'
import { Chrome, rgbaToHexa } from '@uiw/react-color'
import * as React from 'react'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'
import { RGBA } from '../../../dto/generals'
type Props = {
  handleId: string
  nodeId: string
  label: string
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
  let color = props.color || { r: 255, g: 255, b: 255, a: 255 }
  color = { ...color, a: color.a / 255 }
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
      <div>
        <Typography
          variant="caption"
          display="block"
          sx={{
            paddingLeft: '1rem',
            fontSize: '0.6rem',
          }}
        >
          {props.label}
        </Typography>
      </div>
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
        {Math.floor((Math.round(color?.a * 100) / 100) * 255)})
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
              props.onChange({
                r: color.rgba.r,
                g: color.rgba.g,
                b: color.rgba.b,
                a: (Math.round(color.rgba.a * 100) / 100) * 255,
              })
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
