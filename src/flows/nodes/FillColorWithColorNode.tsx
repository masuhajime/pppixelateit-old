import { NodeProps } from 'reactflow'

import { NodeData, handleSources, handleTargets } from './TestNodeBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { HandleSourceImage } from './items/HandleSourceImage'
import { HandleTargetImage } from './items/HandleTargetImage'
import { ImagePreview } from './items/ImagePreview'
import { Separator } from './items/Separator'
import useNodeStore from '../../store/store'
import { NodeStatus } from './components/NodeStatus'

export const Fill00ColorToTransparentNode = ({
  id,
  data,
}: NodeProps<NodeData>) => {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="Fill00ColorToTransparent" />
      <NodeContent>
        <HandleTargetImage
          handleId={handleTargets.image.id}
          nodeId={id}
        ></HandleTargetImage>
        <Separator />
        <HandleSourceImage
          label="Image"
          handleId={handleSources.image.id}
          nodeId={id}
        ></HandleSourceImage>
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
