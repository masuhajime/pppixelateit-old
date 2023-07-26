import { useCallback } from 'react'
import { Handle, Position } from 'reactflow'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Avatar, CardHeader, IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { red } from '@mui/material/colors'

const handleStyle = { left: 10 }

type Props = { data: any; isConnectable: boolean }
export const WhiteToBlackNode = ({ data, isConnectable }: Props) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value)
  }, [])
  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardHeader
          action={<IconButton aria-label="settings"></IconButton>}
          title="White To Black Node"
        />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Word of the Day
          </Typography>
        </CardContent>
      </Card>

      <Handle
        type="source"
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
