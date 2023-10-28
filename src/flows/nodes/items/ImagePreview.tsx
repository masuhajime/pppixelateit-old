import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { arrayBufferToBase64 } from '../../../process/w2b'

type Props = {
  enabled?: boolean
  completed?: boolean
  imageBase64?: string | undefined
  imageBuffer?: Buffer | undefined
  onTogglePreview?: (enabled: boolean) => void
}
export const ImagePreview = ({
  enabled = false,
  completed = false,
  imageBase64,
  imageBuffer,
  onTogglePreview,
}: Props) => {
  const [size, setSize] = useState<
    | {
        x: number
        y: number
      }
    | undefined
  >(undefined)
  const [htmlImageBase64, setHtmlImageBase64] = useState<string | undefined>()
  useEffect(() => {
    if (!imageBuffer) {
      setHtmlImageBase64(undefined)
    }
    if (!enabled) {
      return
    }
    if (!completed) {
      setHtmlImageBase64(undefined)
      return
    }

    if (!!imageBase64) {
      setHtmlImageBase64(imageBase64)
    }
    if (!!imageBuffer) {
      setHtmlImageBase64(
        'data:image/png;base64,' + arrayBufferToBase64(imageBuffer)
      )
    }
  }, [imageBuffer, imageBase64, enabled, completed])

  useEffect(() => {
    if (!htmlImageBase64) {
      setSize(undefined)
      return
    }
    const image = new Image()
    image.src = htmlImageBase64
    image.onload = () => {
      setSize({
        x: image.width,
        y: image.height,
      })
    }
  }, [htmlImageBase64])

  return (
    <Box
      className="node-item"
      // sx={{
      //   display: 'flex',
      //   alignItems: 'center',
      // }}
    >
      {togglePreview(enabled, onTogglePreview, size, completed)}
      {enabled && !completed && <div>waiting</div>}
      {enabled && completed && (
        <>
          {!!imageBase64 && (
            <div
              style={{
                backgroundImage: `url(assets/transparant-background.png)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'repeat',
                lineHeight: 0,
              }}
            >
              <img
                src={imageBase64}
                style={{
                  // width: '100%',
                  maxWidth: '208px',
                  height: 'auto',
                  imageRendering: 'pixelated',
                }}
              />
            </div>
          )}
          {!!imageBuffer && (
            <div
              style={{
                backgroundImage: `url(assets/transparant-background.png)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'repeat',
                lineHeight: 0,
              }}
            >
              <img
                src={htmlImageBase64}
                style={{
                  // width: '100%',
                  maxWidth: '208px',
                  height: 'auto',
                  imageRendering: 'pixelated',
                }}
              />
            </div>
          )}
        </>
      )}
    </Box>
  )
}

const togglePreview = (
  enabled: boolean,
  onTogglePreview?: (enabled: boolean) => void,
  size?: {
    x: number
    y: number
  },
  completed?: boolean
) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '0.2em',
      }}
    >
      {enabled && (
        <VisibilityIcon
          className="nodrag"
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            paddingRight: '0.2em',
          }}
          onClick={() => {
            !!onTogglePreview && onTogglePreview(!enabled)
          }}
        ></VisibilityIcon>
      )}
      {!enabled && (
        <VisibilityOffIcon
          className="nodrag"
          sx={{
            color: 'text.disabled',
            cursor: 'pointer',
            paddingRight: '0.2em',
          }}
          onClick={() => {
            !!onTogglePreview && onTogglePreview(!enabled)
          }}
        ></VisibilityOffIcon>
      )}
      {!!size && enabled && completed && (
        <Box
          sx={{
            display: 'inline-block',
            fontSize: '0.8em',
            color: 'text.disabled',
          }}
        >
          {size.x}x{size.y}
        </Box>
      )}
    </Box>
  )
}
