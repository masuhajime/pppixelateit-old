// @flow
import { Box, Card } from '@mui/material'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { keyframes } from '@mui/system'
import * as React from 'react'
type Props = {
  children: React.ReactNode
  status?: 'processing' | 'waiting' | 'editing'
}
export const Node = (props: Props) => {
  const editable = props.status === undefined || props.status === 'editing'
  return (
    <Card
      sx={{
        maxWidth: 256,
        opacity: editable ? 1 : 0.5,
      }}
    >
      {!editable && (
        <Box
          sx={{
            position: 'absolute',
            width: 'calc(100%)',
            height: 'calc(100%)',
            zIndex: 100,
          }}
        >
          {props.status === 'processing' ? processing() : null}
        </Box>
      )}
      <Box
        sx={{
          overflow: 'visible',
        }}
      >
        {props.children}
      </Box>
    </Card>
  )
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const processing = () => {
  return (
    <>
      <Box>
        <AutorenewIcon
          sx={{
            position: 'absolute',
            top: 'calc(35%)',
            left: 'calc(35%)',
            // set size
            width: 'calc(30%)',
            height: 'calc(30%)',
            animation: `${spin} 2s infinite linear`,
          }}
        ></AutorenewIcon>
      </Box>
    </>
  )
}
