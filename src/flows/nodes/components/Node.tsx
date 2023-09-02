// @flow
import { Card } from '@mui/material'
import * as React from 'react'
type Props = {
  children: React.ReactNode
}
export const Node = (props: Props) => {
  return (
    <Card
      sx={{
        maxWidth: 256,
      }}
    >
      {props.children}
    </Card>
  )
}
