import useNodeStore from '../../store/store'
import {
  BufferSequenceable,
  HandleSource,
  HandleTarget,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData'

export const handleSources: Record<string, HandleSource> = {}

export const handleTargets = {
  imageA: {
    id: 'imageA',
    dataType: 'image',
  } as HandleTarget,
  imageB: {
    id: 'imageB',
    dataType: 'image',
  } as HandleTarget,
}

export type NodeData = {
  settings: {
    enablePreview?: boolean
  }
  imageBufferA?: BufferSequenceable
  imageBufferB?: BufferSequenceable
} & NodeBaseData

export const nodeBehavior: NodeBehaviorInterface = {
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any
  ): void {
    const store = useNodeStore.getState()
    console.log('dataIncoming', nodeId, handleId, dataType, data)

    if (handleId === 'imageA') {
      store.updateNodeData<NodeData>(nodeId, {
        imageBufferA: data,
        completed: false,
      })
    } else if (handleId === 'imageB') {
      store.updateNodeData<NodeData>(nodeId, {
        imageBufferB: data,
        completed: false,
      })
    }
  },
  nodeProcess(nodeId: string, callback: () => void): void {},
  canStartProcess(nodeId: string): boolean {
    return false
  },
}
