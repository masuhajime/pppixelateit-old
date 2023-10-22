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
import { HandleSourceText } from './items/HandleSourceText'
import { fs } from '@tauri-apps/api'
import { HandleSourceDirectory } from './items/HandleSourceDirectory'

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
                console.debug('selectedDir', selectedDir)
                const files = await fs.readDir(selectedDir)
                const filePaths = files.map((file) => {
                  return file.path
                })
                nodeStore.updateNodeData<NodeData>(id, {
                  inputDirectoryPath: selectedDir,
                  inputFilePaths: filePaths,
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
          {data.inputFilePaths !== undefined && (
            <Box>
              {data.inputFilePathsPointer} / {data.inputFilePaths.length}
            </Box>
          )}
        </Box>
        <NodeStatus nodeData={data}></NodeStatus>
        <HandleSourceImage
          handleId={handleSources.image.id}
          label="Image"
          nodeId={id}
        ></HandleSourceImage>
        <HandleSourceDirectory
          handleId={handleSources.directory.id}
          label="Directory"
          nodeId={id}
          placeholder="Directory"
          directory={directoryPath}
          disabled={true}
        ></HandleSourceDirectory>
        <HandleSourceText
          handleId={handleSources.filename.id}
          label="File Name"
          nodeId={id}
        ></HandleSourceText>
        <ImagePreview
          enabled={!!data.settings.enablePreview}
          completed={!!data.completed}
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
