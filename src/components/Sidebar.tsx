// @flow
import { Box, Card, CardHeader, IconButton } from '@mui/material'
import { getNodeTypes } from '../flows/nodes'

const nodeTypes = getNodeTypes()

type Props = {}
export const Sidebar = (props: Props) => {
  const onDragStart = (event: any, nodeType: any) => {
    console.log('onDragStart', nodeType)

    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {nodeTypes.map((nodeType) => {
        return (
          <Box
            draggable
            onDragStart={(event) => onDragStart(event, nodeType.name)}
            sx={{ padding: '4px' }}
            key={nodeType.name}
          >
            <Card
              sx={{
                cursor: 'grab',
              }}
            >
              <CardHeader
                action={<IconButton aria-label="settings"></IconButton>}
                title={nodeType.name}
                titleTypographyProps={{
                  variant: 'h6',
                }}
              />
            </Card>
          </Box>
        )
      })}
    </div>
  )
}
