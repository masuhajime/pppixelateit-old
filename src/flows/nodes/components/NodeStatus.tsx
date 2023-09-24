// @flow
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import { Box } from '@mui/material'
import { NodeBaseData } from '../data/NodeData'
type Props = {
  processTime?: number
  nodeData: NodeBaseData
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
      {!!props.nodeData.processTime ? props.nodeData.processTime : '-'}
    </Box>
  )
}
