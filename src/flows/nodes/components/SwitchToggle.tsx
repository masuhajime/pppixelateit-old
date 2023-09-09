// @flow
import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import * as React from 'react'
type Props = {}

const theme = createTheme({
  components: {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          // Controls default (unchecked) color for the thumb
          color: '#ccc',
        },
        colorPrimary: {
          '&.Mui-checked': {
            // Controls checked color for the thumb
            color: '#f2ff00',
          },
        },
        track: {
          // Controls default (unchecked) color for the track
          opacity: 0.2,
          backgroundColor: '#fff',
          '.Mui-checked.Mui-checked + &': {
            // Controls checked color for the track
            opacity: 0.7,
            backgroundColor: '#fff',
          },
        },
      },
    },
  },
})

export const SwitchToggle = (props: Props) => {
  return <Box></Box>
}
