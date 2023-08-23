import { NodeProps } from 'reactflow'

import { CardHeader, MenuItem } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  NodeData,
  handleSources,
  handleTargets,
} from './ResizeToSideNodeBehavior'
import { HandleSourceImage } from './items/HandleSourceImage'
import { HandleTargetImage } from './items/HandleTargetImage'
import { HandleTargetNumber } from './items/HandleTargetNumber'
import { Select } from './items/Select'
import { Separator } from './items/Separator'
import { ImagePreview } from './items/ImagePreview'

export const ResizeToSideNode = ({ id, data }: NodeProps<NodeData>) => {
  const store = useNodeStore.getState()
  const node = store.getNode<NodeData>(id)

  return (
    <Card
      sx={{
        maxWidth: 256,
      }}
    >
      <CardHeader title="Resize To Side" />
      <CardContent>
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
          defaultValue="nearestNeighbor"
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
        <ImagePreview
          enabled={!!data.completed}
          imageBuffer={data.imageBuffer}
        ></ImagePreview>
      </CardContent>
    </Card>
  )
}
