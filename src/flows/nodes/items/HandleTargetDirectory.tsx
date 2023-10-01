// @flow
import FolderIcon from '@mui/icons-material/Folder'
import { Box, Button } from '@mui/material'
import { open } from '@tauri-apps/api/dialog'
import * as React from 'react'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'

type Props = {
  name: string
  handleId: string
  nodeId: string
  directory?: string
  placeholder: string
  disabled?: boolean
  onChange?: (value?: string) => void
}
const handleSize = 20
export const HandleTargetDirectory = (props: Props) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const updateNodeInternals = useUpdateNodeInternals()
  const [handlePositionTop, setHandlePositionTop] = React.useState(0)
  React.useEffect(() => {
    if (!ref.current) {
      return
    }
    props.onChange && props.onChange(props.directory)
    setHandlePositionTop(ref.current.offsetTop + 28)
  }, [ref.current?.offsetTop])
  React.useEffect(() => {
    updateNodeInternals(props.nodeId)
  }, [handlePositionTop])

  return (
    <Box className="node-item" ref={ref}>
      <Button
        className="nodrag"
        variant="outlined"
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'left',
          textTransform: 'none',
        }}
        onClick={async () => {
          const selectedDir = await open({
            multiple: false,
            directory: true,
            filters: [],
          })
          console.log(selectedDir)
          if (Array.isArray(selectedDir)) {
            // user selectedFile multiple files
            console.error("can't select multiple directories")
          } else if (selectedDir === null) {
            // user cancelled the selection
            console.error("can't select directory")
          } else {
            props.onChange && props.onChange(selectedDir)
          }
        }}
      >
        <FolderIcon
          sx={{
            marginRight: '8px',
          }}
        ></FolderIcon>
        <Box
          sx={{
            // ellipsis
            display: 'inline-block',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
            // direction: 'rtl',
            // textAlign: 'left',
          }}
        >
          {props.directory ? props.directory : props.placeholder}
        </Box>
      </Button>
      {handlePositionTop && (
        <Handle
          type="target"
          position={Position.Left}
          id={props.handleId}
          style={{
            background: 'Violet',
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
