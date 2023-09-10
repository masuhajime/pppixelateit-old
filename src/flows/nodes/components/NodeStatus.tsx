// @flow
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import { Box } from '@mui/material'
type Props = {
  processTime?: number
}
export const NodeStatus = (props: Props) => {
  return (
    <Box className="node-item">
      <PlayCircleIcon></PlayCircleIcon>
      <StopCircleIcon></StopCircleIcon>
      <CheckCircleOutlineIcon
        sx={{
          color: 'lightgreen',
        }}
      ></CheckCircleOutlineIcon>
      <TimerOutlinedIcon></TimerOutlinedIcon>
      {!!props.processTime ? props.processTime : '-'}
    </Box>
  )
}
