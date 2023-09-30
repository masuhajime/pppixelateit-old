import { NodeProps } from 'reactflow'

import useNodeStore, { updateSetting } from '../../store/store'
import { HandleSourceImage } from './items/HandleSourceImage'
import { HandleTargetImage } from './items/HandleTargetImage'
import { HandleTargetNumber } from './items/HandleTargetNumber'
import { Separator } from './items/Separator'
import { ImagePreview } from './items/ImagePreview'
import { Node } from './components/Node'
import { NodeHeader } from './components/NodeHeader'
import { NodeContent } from './components/NodeContent'
import { NodeStatus } from './components/NodeStatus'
import {
  NodeData,
  handleSources,
  handleTargets,
} from './RemoveEdgePixelNodeBehavior'

export const RemoveEdgePixelNode = ({ id, data }: NodeProps<NodeData>) => {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="RemoveEdge" />
      <NodeContent>
        <HandleTargetImage
          handleId={handleTargets.image.id}
          nodeId={id}
        ></HandleTargetImage>
        <HandleTargetNumber
          name="number"
          handleId="number"
          nodeId={id}
          defaultValue={data.settings.threshold || 4}
          onChange={updateSetting(id, 'threshold')}
        ></HandleTargetNumber>
        <Separator />
        <HandleSourceImage
          label="Image"
          handleId={handleSources.image.id}
          nodeId={id}
        ></HandleSourceImage>
        <NodeStatus nodeData={data}></NodeStatus>
        <ImagePreview
          enabled={!!data.settings.enablePreview && data.completed}
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
