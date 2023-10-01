import { getNodeBehaviorCacheByType } from '../../../process/imageProcess'
import useNodeStore, { getNodeSnapshot } from '../../../store/store'

export type PropagateDataType =
  | 'image'
  | 'number'
  | 'buffer'
  | 'text'
  | 'directory'

export type NodeBaseDataSettings = {
  [k: string]: any
}

export type NodeBaseData = {
  settings: NodeBaseDataSettings
  isProcessing: boolean
  completed?: boolean
  processTime?: number
}
export type NodeBaseDataImageBuffer = {
  imageBuffer?: BufferSequenceable
  settings: {
    enablePreview?: boolean
  }
}
export type BufferSequenceable = {
  buffer?: Buffer
  end: boolean
}

// define abstract class of NodeBehavior
// abstract class NodeBehaviorAbstract {
//   initialize?(nodeId: string): void
//   abstract dataIncoming(
//     nodeId: string,
//     handleId: string,
//     dataType: PropagateDataType,
//     data: any
//   ): void
//   abstract nodeProcess(nodeId: string, callback: () => void): void
//   abstract canStartProcess(nodeId: string): boolean
//   hasNextIteration?(nodeId: string): boolean
// }

export interface NodeBehaviorInterface {
  dataIncoming: (
    nodeId: string,
    handleId: string,
    dataType: PropagateDataType,
    data: any
  ) => void
  initialize?(nodeId: string): void
  nodeProcess: (nodeId: string, callback: () => void) => void
  canStartProcess(nodeId: string): boolean
  hasNextIteration?(nodeId: string): boolean
}

export type HandleTarget = {
  id: string
  dataType: PropagateDataType
}

export type HandleSource<T = any> = {
  id: string
  dataType: PropagateDataType
  propagateValue: (nodeId: string) => T
}

export const handleSourceImageDefault = {
  id: 'image',
  dataType: 'buffer',
  propagateValue: (nodeId: string) =>
    getNodeSnapshot<{
      imageBuffer: BufferSequenceable
    }>(nodeId).data.imageBuffer,
} as HandleSource<BufferSequenceable>

export const handleSourceTextDefault = {
  id: 'text',
  dataType: 'text',
  propagateValue: (nodeId: string) =>
    getNodeSnapshot<{
      text: string
    }>(nodeId).data.text,
} as HandleSource<string>

export const handleSourceStringDefault = handleSourceTextDefault

export const defaultNodeInitialize = (nodeId: string) => {
  const store = useNodeStore.getState()
  store.updateNodeData<NodeBaseData>(nodeId, {
    completed: false,
    isProcessing: false,
    processTime: undefined,
  })
}

export const createNodeBehavior = (
  n: Partial<NodeBehaviorInterface>
): NodeBehaviorInterface => {
  return { ...defaultNodeBehavior, ...n } as NodeBehaviorInterface
}
export const defaultNodeBehavior: NodeBehaviorInterface = {
  dataIncoming(nodeId, handleId, dataType, data) {
    throw new Error('node process: should not be incoming:' + nodeId)
  },
  initialize: defaultNodeInitialize,
  nodeProcess(nodeId, callback) {
    throw new Error('node process: should not be processing:' + nodeId)
  },
  canStartProcess(nodeId) {
    return false
  },
  hasNextIteration(nodeId) {
    return false
  },
}

export const propagateValue = (
  nodeId: string,
  handleSources: Record<string, HandleSource>,
  hasNextIteration?: boolean
) => {
  const store = useNodeStore.getState()
  store.getOutgoingEdgesFromSourceNode(nodeId).forEach((edge) => {
    // edge = Handle source
    const targetNode = store.getNode(edge.target)
    if (!targetNode.type) {
      return
    }
    const nodeBehavior = getNodeBehaviorCacheByType(targetNode.type)

    Object.values(handleSources).forEach((handleSource) => {
      if (!edge.targetHandle) {
        return
      }
      if (handleSource.id !== edge.sourceHandle) {
        return
      }
      if (edge.target !== targetNode.id) {
        return
      }
      console.log('propagate value to: ', {
        targetNode,
        handleSource,
        edge,
        nodeId,
      })
      nodeBehavior.dataIncoming(
        targetNode.id,
        edge.targetHandle,
        handleSource.dataType,
        handleSource.propagateValue(nodeId)
      )
    })
  })
}
