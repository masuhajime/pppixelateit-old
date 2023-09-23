import { NodeProps } from 'reactflow'

import ImageIcon from '@mui/icons-material/Image'
import { Box, Button, FormControl } from '@mui/material'
import { fs } from '@tauri-apps/api'
import { open } from '@tauri-apps/api/dialog'
import { Buffer } from 'buffer'
import path from 'path'
import useNodeStore from '../../store/store'
import { NodeData, handleSources } from './ImageInputNodeBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { NodeStatus } from './components/NodeStatus'
import { HandleSourceImage } from './items/HandleSourceImage'
import { ImagePreview } from './items/ImagePreview'
import { HandleSourceDirectory } from './items/HandleSourceDirectory'

export const ImageInputNode = ({ id, data }: NodeProps<NodeData>) => {
  const nodeStore = useNodeStore.getState()

  let inputFilePath = 'Select Image File'
  let directoryPath = undefined
  if (!!data.inputFilePath) {
    // get file name from path
    inputFilePath = path.basename(data.inputFilePath) || 'Select Image File'
    // get last directory name
    directoryPath = path.basename(path.dirname(data.inputFilePath))
  }

  return (
    <Node>
      <NodeHeader title="Image Input" />
      <NodeContent>
        <FormControl
          sx={{
            width: '100%',
          }}
        >
          <Box className="node-item">
            <Button
              className="nodrag"
              variant="outlined"
              sx={{
                width: '100%',
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'left',
                textTransform: 'none',
              }}
              onClick={async () => {
                const selectedFile = await open({
                  multiple: false,
                  filters: [
                    { name: 'Image', extensions: ['png', 'jpeg', 'gif'] },
                  ],
                })
                console.log(selectedFile)
                if (Array.isArray(selectedFile)) {
                  // user selectedFile multiple files
                  console.error("can't select multiple files")
                } else if (selectedFile === null) {
                  // user cancelled the selection
                  console.error("can't select file")
                } else {
                  // user selected a single file
                  fs.readBinaryFile(selectedFile).then((buffer) => {
                    nodeStore.updateNodeData<NodeData>(id, {
                      inputFilePath: selectedFile,
                      imageBuffer: Buffer.from(buffer),
                    })
                  })
                }
              }}
            >
              <ImageIcon
                sx={{
                  marginRight: '8px',
                }}
              ></ImageIcon>
              <Box
                sx={{
                  // ellipsis
                  display: 'inline-block',
                  width: '100%',
                  minWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  // direction: 'rtl',
                  // textAlign: 'left',
                }}
              >
                {inputFilePath}
              </Box>
            </Button>
          </Box>
        </FormControl>
        <HandleSourceDirectory
          handleId={handleSources.directory.id}
          label="Directory"
          nodeId={id}
          placeholder="Directory"
          directory={directoryPath}
          disabled={true}
        ></HandleSourceDirectory>
        <NodeStatus processTime={data.processTime}></NodeStatus>
        <HandleSourceImage
          handleId={handleSources.image.id}
          label="Image"
          nodeId={id}
        ></HandleSourceImage>
        <ImagePreview
          enabled={!!data.settings.enablePreview}
          imageBuffer={data.imageBuffer}
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
