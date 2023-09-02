// @flow
import { CardContent } from '@mui/material'
import * as React from 'react'
type Props = {
  children?: React.ReactNode
}
export const NodeContent = (props: Props) => {
  return (
    <CardContent
      style={{
        padding: '0',
      }}
    >
      {props.children}
    </CardContent>
  )
}
