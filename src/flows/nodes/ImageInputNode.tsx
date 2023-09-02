import { Handle, NodeProps, Position } from 'reactflow'

import { Box, FormControl } from '@mui/material'
import { MuiFileInput } from 'mui-file-input'
import { shallow } from 'zustand/shallow'
import { getBufferFromBase64 } from '../../process/w2b'
import useNodeStore, { RFState } from '../../store/store'
import { NodeData, handleSources } from './ImageInputNodeBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { ImagePreview } from './items/ImagePreview'

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
    <Node>
      <NodeHeader title="Image Input" />
      <NodeContent>
        <FormControl>
          <Box className="node-item">
            <MuiFileInput
              id="my-input"
              value={data.inputFile}
              onChange={onChange}
              inputProps={{
                accept: 'image/*',
              }}
              sx={{
                cursor: 'pointer',
                width: '100%',
              }}
            />
          </Box>
        </FormControl>
        <ImagePreview
          enabled={!!data.settings.enablePreview}
          imageBuffer={data.imageBuffer}
          onTogglePreview={(enabled: boolean) => {
            useNodeStore.getState().updateNodeSetting(id, {
              enablePreview: enabled,
            })
          }}
        ></ImagePreview>
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
      </NodeContent>
    </Node>
  )
}
