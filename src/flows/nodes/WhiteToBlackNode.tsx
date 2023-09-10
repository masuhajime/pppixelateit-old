import { NodeProps } from 'reactflow'

import useNodeStore from '../../store/store'
import {
  NodeData,
  handleSources,
  handleTargets,
} from './WhiteToBlackNodeBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { HandleSourceImage } from './items/HandleSourceImage'
import { HandleTargetImage } from './items/HandleTargetImage'
import { ImagePreview } from './items/ImagePreview'
import { NodeStatus } from './components/NodeStatus'

export const WhiteToBlackNode = ({ id, data }: NodeProps<NodeData>) => {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="White To Black Node" />
      <NodeContent>
        <HandleSourceImage
          label="Image"
          handleId={handleSources.image.id}
          nodeId={id}
        ></HandleSourceImage>
        <HandleTargetImage
          handleId={handleTargets.image.id}
          nodeId={id}
        ></HandleTargetImage>
        <NodeStatus processTime={data.processTime}></NodeStatus>
        <ImagePreview
          enabled={!!data.settings.enablePreview && data.completed}
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
