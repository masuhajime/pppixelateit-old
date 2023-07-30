import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useNodesInitialized,
  useReactFlow,
  useStoreApi,
} from 'reactflow'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { CardHeader, FormControl, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { MuiFileInput } from 'mui-file-input'
import processStore from '../../store/processStore'

type NodeData = {}

export const ImageInputNode = ({
  id,
  data,
  isConnectable,
  selected,
  type,
  dragging,
}: NodeProps<NodeData>) => {
  const store = useStoreApi()

  // Initialize
  // const [initialized, setInitialized] = useState(false)
  // const nodesInitialized = useNodesInitialized({
  //   includeHiddenNodes: true,
  // })
  const [count, setCount] = useState(0)
  // useEffect(() => {
  //   processStore.subscribe((state) => {
  //     console.log(
  //       'process: ImageInputNode',
  //       count,
  //       state.count,
  //       id,
  //       imageBase64
  //     )
  //     onProceed()
  //   })
  //   // if (!initialized && nodesInitialized) {
  //   //   setInitialized(true)
  //   //   processStore.subscribe((state) => {
  //   //     console.log(
  //   //       'process: ImageInputNode',
  //   //       count,
  //   //       state.count,
  //   //       id,
  //   //       imageBase64
  //   //     )
  //   //     onProceed()
  //   //   })
  //   // }
  // }, [nodesInitialized, count])

  const ref = useRef<() => void>(() => {})
  useEffect(() => {
    ref.current()
    ref.current = processStore.subscribe((state) => {
      console.log(
        'process: ImageInputNode',
        count,
        state.count,
        id,
        imageBase64
      )
      onProceed()
    })
  }, [])

  const [inputFile, setInputFile] = useState<File | undefined>(undefined)
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined)

  const onProceed = useCallback(() => {
    console.log('onProceed', id, !!imageBase64, imageBase64)
    if (!!imageBase64) {
      // send image to next node
      // get next node
      const edges = store.getState().edges.find((edge) => {
        return edge.source === id
      })
      console.log('edges', edges)

      processStore.getState().progress()
    }
  }, [imageBase64])

  const onChange = (newValue: File | null) => {
    console.log('onChange', newValue)
    if (newValue instanceof File) {
      // get base64 from file
      const reader = new FileReader()
      reader.readAsDataURL(newValue)
      reader.onload = () => {
        // console.log(reader.result)
        setImageBase64(reader.result as string)
      }
      setInputFile(newValue)
    } else {
      setInputFile(undefined)
      setImageBase64(undefined)
    }
  }
  return (
    <Card
      sx={{
        maxWidth: 256, // TODO: 幅は適当です
      }}
    >
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        aaaa {count}
      </button>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Image Input"
        subheader={id}
      />
      <CardContent>
        <FormControl>
          <MuiFileInput
            id="my-input"
            value={inputFile}
            onChange={onChange}
            inputProps={{
              accept: 'image/*',
            }}
            sx={{
              width: '100%',
            }}
          />
        </FormControl>
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
        type="source"
        position={Position.Right}
        style={{
          right: -8,
          background: 'RoyalBlue',
          width: 16,
          height: 16,
        }}
      />
      {/* <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ top: 100, background: 'red' }}
        id="aba"
      /> */}
    </Card>
  )
}
