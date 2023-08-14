import { Handle, NodeProps, Position } from 'reactflow'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { CardHeader, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {
  HandleTarget,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import { NodeData, handleTargets } from './ImagePreviewNodeBehavior'

export const ImagePreviewNode = ({ id, data }: NodeProps<NodeData>) => {
  return (
    <Card
      sx={{
        maxWidth: 256, // TODO: 幅は適当です
      }}
    >
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Image Preview"
      />
      <CardContent>
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
      <Handle
        type="target"
        id={handleTargets.image.id}
        isValidConnection={(connection) => {
          return true
        }}
        onConnect={(params) => console.log('handle onConnect', id, params)}
        position={Position.Left}
        style={{
          right: -8,
          background: 'OrangeRed',
          width: 16,
          height: 16,
        }}
      />
    </Card>
  )
}
