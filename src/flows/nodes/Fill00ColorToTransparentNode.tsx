import { NodeProps } from 'reactflow'

import { CardHeader } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { NodeData, handleSources, handleTargets } from './TestNodeBehavior'
import { HandleSourceImage } from './items/HandleSourceImage'
import { HandleTargetImage } from './items/HandleTargetImage'
import { ImagePreview } from './items/ImagePreview'
import { Separator } from './items/Separator'

export const Fill00ColorToTransparentNode = ({
  id,
  data,
}: NodeProps<NodeData>) => {
  return (
    <Card
      sx={{
        maxWidth: 256,
      }}
    >
      <CardHeader title="Fill00ColorToTransparent" />
      <CardContent>
        <HandleTargetImage
          handleId={handleTargets.image.id}
          nodeId={id}
        ></HandleTargetImage>
        {/* <HandleTargetNumber
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
        ></HandleTargetNumber> */}
        <Separator />
        <HandleSourceImage
          label="Image"
          handleId={handleSources.image.id}
          nodeId={id}
        ></HandleSourceImage>

        <ImagePreview imageBase64={data.imageBase64}></ImagePreview>
      </CardContent>
    </Card>
  )
}
