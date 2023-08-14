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
        onDragStart={(event) => onDragStart(event, 'ImageInputNode')}
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
        onDragStart={(event) => onDragStart(event, 'WhiteToBlackNode')}
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
        onDragStart={(event) => onDragStart(event, 'ImagePreviewNode')}
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
      <Box
        draggable
        onDragStart={(event) => onDragStart(event, 'ResizeToSideNode')}
        sx={{ padding: '4px' }}
      >
        <Card
          sx={{
            cursor: 'grab',
          }}
        >
          <CardHeader
            title="Resize to side"
            titleTypographyProps={{
              variant: 'h6',
            }}
          />
        </Card>
      </Box>
      <Box
        draggable
        onDragStart={(event) => onDragStart(event, 'PosterizeNode')}
        sx={{ padding: '4px' }}
      >
        <Card
          sx={{
            cursor: 'grab',
          }}
        >
          <CardHeader
            title="PosterizeNode"
            titleTypographyProps={{
              variant: 'h6',
            }}
          />
        </Card>
      </Box>
    </div>
  )
}
