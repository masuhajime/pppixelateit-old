// @flow
import { Box, CardHeader } from '@mui/material'
import { Switch } from './Switch'
import { SwitchToggle } from './SwitchToggle'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
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
