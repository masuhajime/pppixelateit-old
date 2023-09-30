import { NodeProps } from 'reactflow'

import FolderIcon from '@mui/icons-material/Folder'
import { Box, Button, FormControl } from '@mui/material'
import { open } from '@tauri-apps/api/dialog'
import path from 'path'
import useNodeStore from '../../store/store'
import { NodeData, handleSources } from './ImageInputDirectoryNodeBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { NodeStatus } from './components/NodeStatus'
import { HandleSourceImage } from './items/HandleSourceImage'
import { ImagePreview } from './items/ImagePreview'

export const ImageInputDirectoryNode = ({ id, data }: NodeProps<NodeData>) => {
  const nodeStore = useNodeStore.getState()

  let directoryPath = undefined
  if (!!data.inputDirectoryPath) {
    // get last directory name
    directoryPath = path.basename(data.inputDirectoryPath)
  }

  return (
    <Node>
      <NodeHeader title="Image Input Directory" />
      <NodeContent>
        <FormControl
          sx={{
            width: '100%',
          }}
        ></FormControl>

        <Box className="node-item">
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
              if (Array.isArray(selectedDir)) {
                // user selectedFile multiple files
                console.error("can't select multiple files")
              } else if (selectedDir === null) {
                // user cancelled the selection
                console.error("can't select file")
              } else {
                // log
                console.log('selectedDir', selectedDir)
                nodeStore.updateNodeData<NodeData>(id, {
                  inputDirectoryPath: selectedDir,
                })
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
                display: 'inline-block',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {directoryPath ? directoryPath : 'Select Directory'}
            </Box>
          </Button>
        </Box>

        <NodeStatus nodeData={data}></NodeStatus>
        <HandleSourceImage
          handleId={handleSources.image.id}
          label="Image"
          nodeId={id}
        ></HandleSourceImage>
        <ImagePreview
          enabled={!!data.settings.enablePreview}
          imageBuffer={data.imageBuffer?.buffer}
          onTogglePreview={(enabled: boolean) => {
            useNodeStore.getState().updateNodeSetting(id, {
              enablePreview: enabled,
            })
          }}
        ></ImagePreview>
      </NodeContent>
    </Node>
  )
}
