import { NodeProps } from 'reactflow'

import {
  NodeData,
  handleSources,
  handleTargets,
} from './FillColorWithColorNodeBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { HandleSourceImage } from './items/HandleSourceImage'
import { HandleTargetImage } from './items/HandleTargetImage'
import { ImagePreview } from './items/ImagePreview'
import { Separator } from './items/Separator'
import useNodeStore, { updateSetting } from '../../store/store'
import { HandleTargetNumber } from './items/HandleTargetNumber'
import { NodeStatus } from './components/NodeStatus'
export const FillWithColorNode = ({ id, data }: NodeProps<NodeData>) => {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="FillWithColorNode" />
      <NodeContent>
        <HandleTargetImage
          handleId={handleTargets.image.id}
          nodeId={id}
        ></HandleTargetImage>
        <HandleTargetNumber
          handleId={handleTargets.image.id}
          nodeId={id}
          defaultValue={data.settings.x || 0}
          name="x"
          onChange={updateSetting(id, 'x')}
        ></HandleTargetNumber>
        <HandleTargetNumber
          handleId={handleTargets.image.id}
          nodeId={id}
          defaultValue={data.settings.y || 0}
          name="y"
          onChange={updateSetting(id, 'y')}
        ></HandleTargetNumber>
        <HandleTargetNumber
          handleId={handleTargets.image.id}
          nodeId={id}
          defaultValue={data.settings.r || 0}
          name="r"
          onChange={updateSetting(id, 'r')}
        ></HandleTargetNumber>
        <HandleTargetNumber
          handleId={handleTargets.image.id}
          nodeId={id}
          defaultValue={data.settings.g || 0}
          name="g"
          onChange={updateSetting(id, 'g')}
        ></HandleTargetNumber>
        <HandleTargetNumber
          handleId={handleTargets.image.id}
          nodeId={id}
          defaultValue={data.settings.b || 0}
          name="b"
          onChange={updateSetting(id, 'b')}
        ></HandleTargetNumber>
        <HandleTargetNumber
          handleId={handleTargets.image.id}
          nodeId={id}
          defaultValue={data.settings.a || 0}
          name="a"
          onChange={updateSetting(id, 'a')}
        ></HandleTargetNumber>
        <HandleTargetNumber
          handleId={handleTargets.image.id}
          nodeId={id}
          defaultValue={data.settings.tolerance || 30}
          name="tolerance"
          onChange={updateSetting(id, 'tolerance')}
        ></HandleTargetNumber>
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
