import { useCallback, useState } from 'react'
import { Handle, Position } from 'reactflow'
import Input from '@mui/material/Input'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {
  Avatar,
  CardHeader,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { red } from '@mui/material/colors'
import { MuiFileInput } from 'mui-file-input'

type Props = { data: any; isConnectable: boolean }
export const ImagePreviewNode = ({ data, isConnectable }: Props) => {
  const [value, setValue] = useState<File | undefined>(undefined)
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined)

  const handleChange = (newValue: File | null) => {
    console.log(newValue)
    if (newValue instanceof File) {
      // get base64 from file
      const reader = new FileReader()
      reader.readAsDataURL(newValue)
      reader.onload = () => {
        console.log(reader.result)
        setImageBase64(reader.result as string)
      }
      setValue(newValue)
    } else {
      setValue(undefined)
      setImageBase64(undefined)
    }
  }
  return (
    <Card
      sx={{
        maxWidth: 256, // TODO: 幅は適当です
      }}
    >
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Image Preview"
      />
      <CardContent>
        {imageBase64 && (
          <img
            src={imageBase64}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        )}
      </CardContent>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          right: -8,
          background: 'OrangeRed',
          width: 16,
          height: 16,
        }}
      />
    </Card>
  )
}
