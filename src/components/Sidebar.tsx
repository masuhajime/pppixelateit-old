// @flow
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardHeader,
  IconButton,
  Link,
} from '@mui/material'
import * as React from 'react'
type Props = {}
export const Sidebar = (props: Props) => {
  const onDragStart = (event: any, nodeType: any) => {
    console.log('onDragStart', nodeType)

    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  /*
  inputImage
whiteToBlack
imagePreviewNode
*/
  return (
    <div>
      <Box
        draggable
        onDragStart={(event) => onDragStart(event, 'whiteToBlack')}
        sx={{ padding: '4px' }}
      >
        <Card
          sx={{
            cursor: 'grab',
          }}
        >
          <CardHeader
            action={<IconButton aria-label="settings"></IconButton>}
            title="White To Black Node"
            titleTypographyProps={{
              variant: 'h6',
            }}
          />
        </Card>
      </Box>
      <Box
        draggable
        onDragStart={(event) => onDragStart(event, 'inputImage')}
        sx={{ padding: '4px' }}
      >
        <Card
          sx={{
            cursor: 'grab',
          }}
        >
          <CardHeader
            action={<IconButton aria-label="settings"></IconButton>}
            title="Image Input"
            titleTypographyProps={{
              variant: 'h6',
            }}
          />
        </Card>
      </Box>
      <Box
        draggable
        onDragStart={(event) => onDragStart(event, 'imagePreviewNode')}
        sx={{ padding: '4px' }}
      >
        <Card
          sx={{
            cursor: 'grab',
          }}
        >
          <CardHeader
            title="Image Preview"
            titleTypographyProps={{
              variant: 'h6',
            }}
          />
        </Card>
      </Box>
    </div>
  )
}
