import useNodeStore from '../../store/store'
import {
  HandleSource,
  HandleTarget,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData'

export const handleSources: Record<string, HandleSource> = {}

export const handleTargets: Record<string, HandleTarget> = {
  imageA: {
    id: 'imageA',
    dataType: 'image',
  },
  imageB: {
    id: 'imageB',
    dataType: 'image',
  },
}

export type NodeData = {
  settings: {
    enablePreview?: boolean
  }
  imageBufferA?: Buffer
  imageBufferB?: Buffer
} & NodeBaseData

export const nodeBehavior: NodeBehaviorInterface = {
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any
  ): void {
    const store = useNodeStore.getState()
    if (handleId === 'imageA') {
      store.updateNodeData<NodeData>(nodeId, {
        imageBufferA: data,
      })
    } else if (handleId === 'imageB') {
      store.updateNodeData<NodeData>(nodeId, {
        imageBufferB: data,
      })
    }
  },
  nodeProcess(nodeId: string, callback: () => void): void {},
  canStartProcess(nodeId: string): boolean {
    return false
  },
}
