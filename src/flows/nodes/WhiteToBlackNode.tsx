import { useCallback } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

import { CardHeader, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import {
  NodeData,
  handleSources,
  handleTargets,
} from './WhiteToBlackNodeBehavior'
import { ImagePreview } from './items/ImagePreview'

export const WhiteToBlackNode = ({
  id,
  data,
  isConnectable,
}: NodeProps<NodeData>) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value)
  }, [])
  return (
    <>
      <Card sx={{ maxWidth: 256 }}>
        <CardHeader
          action={<IconButton aria-label="settings"></IconButton>}
          title="White To Black Node"
        />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Word of the Day
          </Typography>

          <ImagePreview imageBase64={data.imageBase64}></ImagePreview>
        </CardContent>
      </Card>

      <Handle
        type="source"
        id={handleSources.image.id}
        position={Position.Right}
        style={{
          right: -8,
          background: 'RoyalBlue',
          width: 16,
          height: 16,
        }}
      />
      <Handle
        type="target"
        id={handleTargets.image.id}
        position={Position.Left}
        style={{
          right: -8,
          background: 'OrangeRed',
          width: 16,
          height: 16,
        }}
      />
    </>
  )
}
