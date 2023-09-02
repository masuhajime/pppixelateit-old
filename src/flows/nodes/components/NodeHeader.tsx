// @flow
import { CardHeader } from '@mui/material'
type Props = {
  title?: string
}
export const NodeHeader = (props: Props) => {
  return (
    <CardHeader
      title={props.title}
      style={
        {
          //backgroundColor: '#f5f5f5',
        }
      }
    ></CardHeader>
  )
}
