import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  HandleTarget,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData'

export const handleTargets: Record<string, HandleTarget> = {
  image: {
    id: 'image',
    dataType: 'image',
  },
}

export type NodeData = {
  imageBase64?: string
} & NodeBaseData

export const nodeBehavior: NodeBehaviorInterface = {
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any
  ): void {
    const node = getNodeSnapshot<NodeData>(nodeId)
    //data.completed = true
    console.log('dataIncoming:', node.id, handleId, dataType)
    const store = useNodeStore.getState()
    store.updateNodeData(nodeId, {
      ...node.data,
      imageBase64: data,
    })
  },
  nodeProcess(nodeId: string): void {
    const node = getNodeSnapshot<NodeData>(nodeId)
    //data.completed = true
    console.error('node process:', node.id, node.type)
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    return !!node.data.imageBase64
  },
}
