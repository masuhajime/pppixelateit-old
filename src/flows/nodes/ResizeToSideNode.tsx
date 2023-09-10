import { NodeProps } from 'reactflow'

import { MenuItem } from '@mui/material'
import useNodeStore from '../../store/store'
import {
  NodeData,
  handleSources,
  handleTargets,
} from './ResizeToSideNodeBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { NodeStatus } from './components/NodeStatus'
import { HandleSourceImage } from './items/HandleSourceImage'
import { HandleTargetImage } from './items/HandleTargetImage'
import { HandleTargetNumber } from './items/HandleTargetNumber'
import { ImagePreview } from './items/ImagePreview'
import { Select } from './items/Select'
import { Separator } from './items/Separator'

export const ResizeToSideNode = ({ id, data }: NodeProps<NodeData>) => {
  const store = useNodeStore.getState()
  const node = store.getNode<NodeData>(id)

  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="Resize To Side" />
      <NodeContent>
        <HandleTargetImage
          handleId={handleTargets.image.id}
          nodeId={id}
        ></HandleTargetImage>
        <Select
          label={'Resize Base'}
          nodeId={id}
          defaultValue="width"
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              resizeBase: value,
            })
          }}
        >
          <MenuItem value={'width'}>Width</MenuItem>
          <MenuItem value={'height'}>Height</MenuItem>
        </Select>
        <HandleTargetNumber
          name="size"
          handleId="size"
          nodeId={id}
          defaultValue={node.data.settings.size || 128}
          onChange={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              size: value,
            })
          }}
        ></HandleTargetNumber>
        <Select
          label={'Method'}
          nodeId={id}
          defaultValue={data.settings.method || 'nearestNeighbor'}
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              method: value,
            })
          }}
        >
          <MenuItem value={'nearestNeighbor'}>NearestNeighbor</MenuItem>
          <MenuItem value={'bilinearInterpolation'}>Bilinear</MenuItem>
          <MenuItem value={'bicubicInterpolation'}>Bicubic</MenuItem>
          <MenuItem value={'hermiteInterpolation'}>Hermite</MenuItem>
          <MenuItem value={'bezierInterpolation'}>Bezier</MenuItem>
        </Select>
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
