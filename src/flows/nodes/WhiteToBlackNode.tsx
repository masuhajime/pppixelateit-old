import { useCallback } from 'react'
import { Handle, Node, NodeProps, Position } from 'reactflow'

import { CardHeader, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import {
  HandleTarget,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import { getNodeBehavior } from '../../process/process'

const handleTargets: Record<string, HandleTarget> = {
  image: {
    id: 'image',
    type: 'image',
  },
}

const handleSources = {
  image: {
    id: 'image',
    type: 'image',
  },
}

type NodeData = {
  imageBase64?: string
} & NodeBaseData

export const nodeBehavior: NodeBehaviorInterface = {
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any
  ): void {
    const node = getNodeSnapshot(nodeId)
    //data.completed = true
    console.log('dataIncoming:', nodeId, handleId, dataType, data)

    const store = useNodeStore.getState()
    store.updateNodeData(nodeId, {
      ...node.data,
      imageBase64: data,
    })
    console.log('node', store.getNode(nodeId))

    if (this.canStartProcess(node.id)) {
      this.nodeProcess(node.id)
    }
  },
  nodeProcess(nodeId: string): void {
    const node = getNodeSnapshot(nodeId)
    if (!this.canStartProcess(node.id)) {
      return
    }
    console.log('node process:', node.id, node.type)

    const store = useNodeStore.getState()
    store.getOutgoingEdgesFromSourceNode(nodeId).forEach((edge) => {
      console.log('edge', edge)

      const targetNode = store.getNode(edge.target)
      if (!targetNode.type) {
        return
      }

      getNodeBehavior(targetNode.type).then((behavior) => {
        console.log('behavior', behavior)
        if (!edge.targetHandle) {
          return
        }
        behavior.dataIncoming(
          targetNode.id,
          edge.targetHandle,
          'image',
          node.data.imageBase64
        )
      })
    })
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot(nodeId)
    return !!node.data.imageBase64
  },
}

export const WhiteToBlackNode = ({
  id,
  data,
  isConnectable,
}: NodeProps<NodeData>) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value)
  }, [])
  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardHeader
          action={<IconButton aria-label="settings"></IconButton>}
          title="White To Black Node"
        />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Word of the Day
          </Typography>
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
      </Card>

      <Handle
        type="source"
        id={handleSources.image.id}
        position={Position.Right}
        style={{
          right: -8,
          background: 'RoyalBlue',
          width: 16,
          height: 16,
        }}
      />
      <Handle
        type="target"
        id={handleTargets.image.id}
        position={Position.Left}
        style={{
          right: -8,
          background: 'OrangeRed',
          width: 16,
          height: 16,
        }}
      />
    </>
  )
}
