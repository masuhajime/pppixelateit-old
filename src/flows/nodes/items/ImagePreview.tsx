import { useEffect, useState } from 'react'
import { arrayBufferToBase64 } from '../../../process/w2b'

type Props = {
  enabled?: boolean
  imageBase64?: string | undefined
  imageBuffer?: Buffer | undefined
  onTogglePreview?: (enabled: boolean) => void
}
export const ImagePreview = ({
  enabled = false,
  imageBase64,
  imageBuffer,
  onTogglePreview,
}: Props) => {
  const [htmlImageBase64, setHtmlImageBase64] = useState<string | undefined>()
  useEffect(() => {
    console.log('useEffect ImagePreview')

    if (!!imageBase64) {
      setHtmlImageBase64(imageBase64)
    }
    if (!!imageBuffer) {
      setHtmlImageBase64(
        'data:image/png;base64,' + arrayBufferToBase64(imageBuffer)
      )
    }
  }, [imageBuffer, imageBase64])

  return (
    <div>
      {togglePreview(enabled, onTogglePreview)}
      {enabled && (
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
                  width: '100%',
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
                  width: '100%',
                  maxWidth: '208px',
                  height: 'auto',
                  imageRendering: 'pixelated',
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

const togglePreview = (
  enabled: boolean,
  onTogglePreview?: (enabled: boolean) => void
) => {
  return (
    <>
      <div
        onClick={() => {
          !!onTogglePreview && onTogglePreview(!enabled)
        }}
      >
        preview: {enabled ? 'Y' : 'N'}
      </div>
    </>
  )
}
