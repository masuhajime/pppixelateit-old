import { getNodeBehavior } from '../../../process/imageProcess'
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

export type NodeBaseDataImageBase64 = {
  imageBase64?: string
}

export type NodeBaseDataImageBuffer = {
  imageBuffer?: Buffer
  settings: {
    enablePreview?: boolean
  }
}

export interface NodeBehaviorInterface {
  dataIncoming: (
    nodeId: string,
    handleId: string,
    dataType: PropagateDataType,
    data: any
  ) => void
  nodeProcess: (nodeId: string, callback: () => void) => void
  canStartProcess(nodeId: string): boolean
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
      imageBuffer: Buffer
    }>(nodeId).data.imageBuffer,
} as HandleSource<Buffer>

export const handleSourceTextDefault = {
  id: 'text',
  dataType: 'text',
  propagateValue: (nodeId: string) =>
    getNodeSnapshot<{
      text: string
    }>(nodeId).data.text,
} as HandleSource<string>

export const handleSourceStringDefault = handleSourceTextDefault

export const propagateValue = (
  nodeId: string,
  handleSources: Record<string, HandleSource>
) => {
  const store = useNodeStore.getState()
  store.getOutgoingEdgesFromSourceNode(nodeId).forEach((edge) => {
    // edge = Handle source
    const targetNode = store.getNode(edge.target)
    if (!targetNode.type) {
      return
    }
    getNodeBehavior(targetNode.type).then((behavior) => {
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
        // console.log('propagate value to: ', {
        //   targetNode,
        //   handleSource,
        //   edge,
        //   nodeId,
        // })
        behavior.dataIncoming(
          targetNode.id,
          edge.targetHandle,
          handleSource.dataType,
          handleSource.propagateValue(nodeId)
        )
      })
    })
  })
}
