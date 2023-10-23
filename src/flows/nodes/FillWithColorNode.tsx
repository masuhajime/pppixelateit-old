import { NodeProps } from 'reactflow'

import {
  NodeData,
  NodeDataSettings,
  handleSources,
  handleTargets,
} from './FillWithColorNodeBehavior'
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
import { HandleTargetColor } from './items/HandleTargetColor'

export const FillWithColorNode = ({ id, data }: NodeProps<NodeData>) => {
  const color =
    data.settings.a && data.settings.r && data.settings.g && data.settings.b
      ? {
          a: data.settings.a,
          r: data.settings.r,
          g: data.settings.g,
          b: data.settings.b,
        }
      : {
          a: 1,
          r: 255,
          g: 255,
          b: 255,
        }
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="FillWithColorNode" />
      <NodeContent>
        <HandleTargetImage
          handleId={handleTargets.image.id}
          nodeId={id}
        ></HandleTargetImage>
        <HandleTargetNumber
          handleId={handleTargets.x.id}
          nodeId={id}
          defaultValue={data.settings.x || 0}
          name="x"
          onChange={updateSetting(id, 'x')}
        ></HandleTargetNumber>
        <HandleTargetNumber
          handleId={handleTargets.y.id}
          nodeId={id}
          defaultValue={data.settings.y || 0}
          name="y"
          onChange={updateSetting(id, 'y')}
        ></HandleTargetNumber>
        <HandleTargetNumber
          handleId={handleTargets.tolerance.id}
          nodeId={id}
          defaultValue={data.settings.tolerance || 16}
          name="tolerance"
          onChange={updateSetting(id, 'tolerance')}
        ></HandleTargetNumber>
        <HandleTargetColor
          handleId={handleTargets.image.id}
          nodeId="aaa"
          color={color}
          onChange={(color) => {
            useNodeStore.getState().updateNodeSetting<NodeDataSettings>(id, {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a,
            })
          }}
        ></HandleTargetColor>
        <Separator />
        <HandleSourceImage
          label="Image"
          handleId={handleSources.image.id}
          nodeId={id}
        ></HandleSourceImage>
        <NodeStatus nodeData={data}></NodeStatus>
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
