import { NodeProps } from 'reactflow'

import { CardHeader, IconButton, MenuItem } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { getNodeBehavior } from '../../process/imageProcess'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  HandleTarget,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData'
import { HandleSourceImage } from './items/HandleSourceImage'
import { HandleTargetImage } from './items/HandleTargetImage'
import { HandleTargetNumber } from './items/HandleTargetNumber'
import { Select } from './items/Select'
import { Separator } from './items/Separator'
import {
  NodeData,
  handleSources,
  handleTargets,
} from './ResizeToSideNodeBehavior'

export const ResizeToSideNode = ({ id, data }: NodeProps<NodeData>) => {
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
            useNodeStore.getState().updateNodeData(id, {
              ...data,
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
          defaultValue={128}
          onChange={(value) => {
            useNodeStore.getState().updateNodeData(id, {
              ...data,
              size: value,
            })
          }}
        ></HandleTargetNumber>
        <Select
          label={'Method'}
          nodeId={id}
          defaultValue="nearestNeighbor"
          onSelect={(value) => {
            useNodeStore.getState().updateNodeData(id, {
              ...data,
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
        {data.imageBase64 && (
          <img
            src={data.imageBase64}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
