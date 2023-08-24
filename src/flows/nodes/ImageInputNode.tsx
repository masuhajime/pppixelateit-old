import { Handle, NodeProps, Position } from 'reactflow'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { CardHeader, FormControl, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { MuiFileInput } from 'mui-file-input'
import { shallow } from 'zustand/shallow'
import useNodeStore, { RFState } from '../../store/store'
import { NodeData, handleSources } from './ImageInputNodeBehavior'
import { ImagePreview } from './items/ImagePreview'
import { getBuffer, getBufferFromBase64 } from '../../process/w2b'

export const ImageInputNode = ({ id, data }: NodeProps<NodeData>) => {
  const { updateNodeData } = useNodeStore(
    (state: RFState) => ({
      getNode: state.getNode,
      getNodeTargetedFrom: state.getNodeTargetedFrom,
      updateNodeData: state.updateNodeData,
    }),
    shallow
  )

  const onChange = (inputFile: File | null) => {
    console.log('onChange', inputFile)
    if (inputFile instanceof File) {
      // get base64 from file
      const reader = new FileReader()
      reader.onload = () => {
        const buffer = getBufferFromBase64(reader.result as string)
        updateNodeData<NodeData>(id, {
          imageBuffer: buffer,
        })
      }
      reader.readAsDataURL(inputFile)
      updateNodeData<NodeData>(id, {
        inputFile: inputFile,
      })
    } else {
      updateNodeData<NodeData>(id, {
        imageBuffer: undefined,
        inputFile: undefined,
      })
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
        subheader={id}
      />
      <CardContent>
        <FormControl>
          <MuiFileInput
            id="my-input"
            value={data.inputFile}
            onChange={onChange}
            inputProps={{
              accept: 'image/*',
            }}
            sx={{
              width: '100%',
            }}
          />
        </FormControl>
        <ImagePreview
          enabled={true}
          imageBuffer={data.imageBuffer}
        ></ImagePreview>
      </CardContent>
      <Handle
        type="source"
        position={Position.Right}
        id={handleSources.image.id}
        onConnect={(params) => console.log('handle onConnect', id, params)}
        style={{
          right: -8,
          background: 'RoyalBlue',
          width: 16,
          height: 16,
        }}
      />
    </Card>
  )
}
