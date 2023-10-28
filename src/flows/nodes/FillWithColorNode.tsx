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
import { Select } from './items/Select'
import { MenuItem } from '@mui/material'

export const FillWithColorNode = ({ id, data }: NodeProps<NodeData>) => {
  const colorTarget =
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
  const colorFill =
    data.settings.a2 && data.settings.r2 && data.settings.g2 && data.settings.b2
      ? {
          a: data.settings.a2,
          r: data.settings.r2,
          g: data.settings.g2,
          b: data.settings.b2,
        }
      : {
          a: 1,
          r: 255,
          g: 255,
          b: 255,
        }
  const method = data.settings.method || 'top_left_pixel'
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="FillWithColorNode" />
      <NodeContent>
        <HandleTargetImage
          handleId={handleTargets.image.id}
          nodeId={id}
        ></HandleTargetImage>
        <Select
          label={'Method'}
          nodeId={id}
          defaultValue={method}
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              method: value,
            })
          }}
        >
          <MenuItem value={'top_left_pixel'}>Top Left Pixel</MenuItem>
          <MenuItem value={'fixed_target_color'}>Fixed Target Color</MenuItem>
        </Select>
        <HandleTargetNumber
          handleId={handleTargets.tolerance.id}
          nodeId={id}
          defaultValue={data.settings.tolerance || 16}
          name="tolerance"
          onChange={updateSetting(id, 'tolerance')}
        ></HandleTargetNumber>
        {method === 'fixed_target_color' && (
          <HandleTargetColor
            label="Target Color"
            handleId={handleTargets.colorTarget.id}
            nodeId={id}
            color={colorTarget}
            onChange={(color) => {
              useNodeStore.getState().updateNodeSetting<NodeDataSettings>(id, {
                r: color.r,
                g: color.g,
                b: color.b,
                a: color.a,
              })
            }}
          />
        )}
        <HandleTargetColor
          label="Fill Color"
          handleId={handleTargets.colorFill.id}
          nodeId={id}
          color={colorFill}
          onChange={(color) => {
            useNodeStore.getState().updateNodeSetting<NodeDataSettings>(id, {
              r2: color.r,
              g2: color.g,
              b2: color.b,
              a2: color.a,
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
