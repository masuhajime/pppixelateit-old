import { useState } from 'react'
import { Handle, Node, NodeProps, Position } from 'reactflow'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { CardHeader, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {
  HandleTarget,
  IncomingDataType,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData'
import useNodeStore, { getNodeSnapshot } from '../../store/store'

const handleTargets: Record<string, HandleTarget> = {
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
    console.log('dataIncoming:', node.id, handleId, dataType, data)
    const store = useNodeStore.getState()
    store.updateNodeData(nodeId, {
      ...node.data,
      imageBase64: data,
    })
  },
  nodeProcess(nodeId: string): void {
    const node = getNodeSnapshot(nodeId)
    //data.completed = true
    console.error('node process:', node.id, node.type)
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot(nodeId)
    return !!node.data.imageBase64
  },
}

export const ImagePreviewNode = ({ id, data }: NodeProps<NodeData>) => {
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
      {/* <Handle
        type="target"
        id={data.input.image.id}
        onConnect={(params) => console.log('handle onConnect', id, params)}
        position={Position.Left}
        style={{
          top: '0',
          background: 'Yellow',
          width: 16,
          height: 16,
        }}
      /> */}
      <Handle
        type="target"
        id={handleTargets.image.id}
        isValidConnection={(connection) => {
          return true
        }}
        onConnect={(params) => console.log('handle onConnect', id, params)}
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
