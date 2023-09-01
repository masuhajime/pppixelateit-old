import { NodeProps } from 'reactflow'

import { CardHeader } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import useNodeStore from '../../store/store'
import { NodeData, handleSources, handleTargets } from './TestNodeBehavior'
import { HandleSourceImage } from './items/HandleSourceImage'
import { HandleTargetImage } from './items/HandleTargetImage'
import { HandleTargetNumber } from './items/HandleTargetNumber'
import { Separator } from './items/Separator'
import { ImagePreview } from './items/ImagePreview'

export const TestNode = ({ id, data }: NodeProps<NodeData>) => {
  return (
    <Card
      sx={{
        maxWidth: 256,
      }}
    >
      <CardHeader title="TestNode" />
      <CardContent
        style={{
          padding: '0',
        }}
      >
        <HandleTargetImage
          handleId={handleTargets.image.id}
          nodeId={id}
        ></HandleTargetImage>
        <HandleTargetNumber
          name="number"
          handleId="number"
          nodeId={id}
          defaultValue={5}
          onChange={(value) => {
            useNodeStore.getState().updateNodeData(id, {
              ...data,
              number: value,
            })
          }}
        ></HandleTargetNumber>
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
