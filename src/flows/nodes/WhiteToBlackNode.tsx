import { useCallback } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

import { CardHeader, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import {
  HandleTarget,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import { greyscale } from '../../process/w2b'
import { getNodeBehavior } from '../../process/imageProcess'
import {
  NodeData,
  handleSources,
  handleTargets,
} from './WhiteToBlackNodeBehavior'

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
          {data.imageBase64 && (
            <img
              src={data.imageBase64}
              style={{
                width: '100%',
                height: 'auto',
                imageRendering: 'pixelated',
              }}
            />
          )}
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
