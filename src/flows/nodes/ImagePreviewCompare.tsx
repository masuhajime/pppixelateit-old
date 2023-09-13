import { NodeProps } from 'reactflow'

import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider'
import { arrayBufferToBase64 } from '../../process/w2b'
import { NodeData, handleTargets } from './ImagePreviewCompareBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { NodeStatus } from './components/NodeStatus'
import { HandleTargetImage } from './items/HandleTargetImage'
import { Separator } from './items/Separator'

export const ImagePreviewCompare = ({ id, data }: NodeProps<NodeData>) => {
  const [htmlImageBase64A, setHtmlImageBase64A] = useState<string | undefined>()
  const [htmlImageBase64B, setHtmlImageBase64B] = useState<string | undefined>()
  useEffect(() => {
    if (!data.imageBufferA) {
      setHtmlImageBase64A(undefined)
    }
    if (!!data.imageBufferA) {
      setHtmlImageBase64A(
        'data:image/png;base64,' + arrayBufferToBase64(data.imageBufferA)
      )
    }
  }, [data.imageBufferA])
  useEffect(() => {
    if (!data.imageBufferB) {
      setHtmlImageBase64B(undefined)
    }
    if (!!data.imageBufferB) {
      setHtmlImageBase64B(
        'data:image/png;base64,' + arrayBufferToBase64(data.imageBufferB)
      )
    }
  }, [data.imageBufferB])

  return (
    <Node>
      <NodeHeader title="Image Compare" />
      <NodeContent>
        <HandleTargetImage
          handleId={handleTargets.imageA.id}
          nodeId={id}
        ></HandleTargetImage>
        <HandleTargetImage
          handleId={handleTargets.imageB.id}
          nodeId={id}
        ></HandleTargetImage>
        <Separator />
        <NodeStatus processTime={data.processTime}></NodeStatus>
        {/* </NodeContent> */}

        {!!htmlImageBase64A && !!htmlImageBase64B && (
          <Box
            className="nodrag"
            sx={{
              backgroundColor: 'white',
            }}
          >
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  style={{
                    imageRendering: 'pixelated',
                    backgroundImage: `url(assets/transparant-background.png)`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'repeat',
                  }}
                  src={htmlImageBase64A}
                  alt="Image one"
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  style={{
                    imageRendering: 'pixelated',
                    backgroundImage: `url(assets/transparant-background.png)`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'repeat',
                  }}
                  src={htmlImageBase64B}
                  alt="Image two"
                />
              }
            />
          </Box>
        )}
      </NodeContent>
    </Node>
  )
}
