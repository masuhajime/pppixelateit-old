import { NodeProps } from 'reactflow'

import useNodeStore from '../../store/store'
import { NodeData, handleTargets } from './SaveImageNodeBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { NodeStatus } from './components/NodeStatus'
import { HandleTargetDirectory } from './items/HandleTargetDirectory'
import { HandleTargetImage } from './items/HandleTargetImage'
import { HandleTargetText } from './items/HandleTargetText'
import { Separator } from './items/Separator'
import path from 'path'

export const SaveImageNode = ({ id, data }: NodeProps<NodeData>) => {
  const dir = path.basename(data.directory || data.settings.directory || '')
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="Save Image" />
      <NodeContent>
        <HandleTargetImage
          handleId={handleTargets.image.id}
          nodeId={id}
        ></HandleTargetImage>
        <HandleTargetText
          name="file name"
          handleId={handleTargets.filename.id}
          nodeId={id}
          defaultValue={data.filename || data.settings.filename || ''}
          onChange={(value) => {
            useNodeStore.getState().updateNodeData<NodeData>(id, {
              filename: value,
            })
          }}
        ></HandleTargetText>
        <HandleTargetDirectory
          directory={data.directory || data.settings.directory}
          placeholder="Select Directory"
          handleId={handleTargets.directory.id}
          nodeId={id}
          onChange={(value) => {
            useNodeStore.getState().updateNodeData<NodeData>(id, {
              directory: value,
            })
          }}
          name="directory"
        ></HandleTargetDirectory>
        <Separator />
        <NodeStatus nodeData={data}></NodeStatus>
      </NodeContent>
    </Node>
  )
}
