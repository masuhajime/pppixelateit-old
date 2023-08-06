import { useState } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { CardHeader, FormControl, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { MuiFileInput } from 'mui-file-input'
import { shallow } from 'zustand/shallow'
import useNodeStore, { RFState } from '../../store/store'
import { NodeData, handleSources } from './ImageInputNodeBehavior'

export const ImageInputNode = ({ id, data }: NodeProps<NodeData>) => {
  const { getNode, getNodeTargetedFrom, updateNodeData } = useNodeStore(
    (state: RFState) => ({
      getNode: state.getNode,
      getNodeTargetedFrom: state.getNodeTargetedFrom,
      updateNodeData: state.updateNodeData,
    }),
    shallow
  )

  // Initialize
  // const [initialized, setInitialized] = useState(false)
  // const nodesInitialized = useNodesInitialized({
  //   includeHiddenNodes: true,
  // })
  const [count, setCount] = useState(0)
  // useEffect(() => {
  //   if (!initialized && nodesInitialized) {
  //     setInitialized(true)
  //     processStore.subscribe((state) => {
  //       // console.log(
  //       //   'process: ImageInputNode',
  //       //   count,
  //       //   state.count,
  //       //   id,
  //       //   imageBase64,
  //       //   getNode(id).data.color
  //       // )
  //       // onProceed()
  //     })
  //   }
  // }, [nodesInitialized, count])

  // const ref = useRef<() => void>(() => {})
  // useEffect(() => {
  //   ref.current()
  //   ref.current = processStore.subscribe((state) => {
  //     console.log(
  //       'process: ImageInputNode',
  //       count,
  //       state.count,
  //       id,
  //       imageBase64
  //     )
  //     onProceed()
  //   })
  // }, [])

  //const [inputFile, setInputFile] = useState<File | undefined>(undefined)
  // const [imageBase64, setImageBase64] = useState<string | undefined>(undefined)

  // const onProceed = useCallback(() => {
  //   const nodeData = getNode(id).data
  //   console.log('onProceed', id, !!nodeData.imageBase64, nodeData.imageBase64)
  //   if (!!nodeData.imageBase64) {
  //     // send image to next node
  //     // get next node
  //     // const edges = store.getState().edges.find((edge) => {
  //     //   return edge.source === id
  //     // })
  //     // console.log('edges', edges)

  //     // TODO: infinite loop.....

  //     console.log('getNodeTargetedFrom', id, getNodeTargetedFrom(id))
  //     // processStore.getState().progress()
  //   }
  // }, [])

  const onChange = (inputFile: File | null) => {
    console.log('onChange', inputFile)
    if (inputFile instanceof File) {
      // get base64 from file
      const reader = new FileReader()
      reader.onload = () => {
        updateNodeData<NodeData>(id, {
          imageBase64: reader.result as string,
        })
      }
      reader.readAsDataURL(inputFile)
      updateNodeData<NodeData>(id, {
        inputFile: inputFile,
      })
    } else {
      updateNodeData<NodeData>(id, {
        imageBase64: undefined,
        inputFile: undefined,
      })
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
        {count}
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
            value={data.inputFile}
            onChange={onChange}
            inputProps={{
              accept: 'image/*',
            }}
            sx={{
              width: '100%',
            }}
          />
        </FormControl>
        {data.imageBase64 && (
          <img
            src={data.imageBase64}
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
        id={handleSources.image.id}
        onConnect={(params) => console.log('handle onConnect', id, params)}
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
