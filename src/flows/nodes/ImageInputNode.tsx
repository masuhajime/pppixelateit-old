import { useState } from 'react'
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useReactFlow,
  useStoreApi,
} from 'reactflow'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { CardHeader, FormControl, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { MuiFileInput } from 'mui-file-input'

type NodeData = {}

type CustomNode = Node<NodeData>

export const ImageInputNode = ({}: NodeProps<NodeData>) => {
  const { setNodes } = useReactFlow()
  const store = useStoreApi()

  const [value, setValue] = useState<File | undefined>(undefined)
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined)

  const onChange = (newValue: File | null) => {
    console.log(newValue)
    if (newValue instanceof File) {
      // get base64 from file
      const reader = new FileReader()
      reader.readAsDataURL(newValue)
      reader.onload = () => {
        console.log(reader.result)
        setImageBase64(reader.result as string)
      }
      setValue(newValue)
    } else {
      setValue(undefined)
      setImageBase64(undefined)
    }
  }
  return (
    <Card
      sx={{
        maxWidth: 256, // TODO: 幅は適当です
      }}
    >
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Image Input"
      />
      <CardContent>
        <FormControl>
          <MuiFileInput
            id="my-input"
            value={value}
            onChange={onChange}
            inputProps={{
              accept: 'image/*',
            }}
            sx={{
              width: '100%',
            }}
          />
        </FormControl>
        {imageBase64 && (
          <img
            src={imageBase64}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        )}
      </CardContent>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          right: -8,
          background: 'RoyalBlue',
          width: 16,
          height: 16,
        }}
      />
      {/* <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ top: 100, background: 'red' }}
        id="aba"
      /> */}
    </Card>
  )
}
