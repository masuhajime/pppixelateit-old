import { getNodeBehavior } from '../../../process/imageProcess'
import useNodeStore, { getNodeSnapshot } from '../../../store/store'

export type PropagateDataType = 'image' | 'number' | 'buffer'

export type NodeBaseDataSettings = {
  [k: string]: any
}

export type NodeBaseData = {
  settings: NodeBaseDataSettings
  isProcessing: boolean
  completed?: boolean
}

export type NodeBaseDataImageBase64 = {
  imageBase64?: string
}

export type NodeBaseDataImageBuffer = {
  imageBuffer?: Buffer
}

export interface NodeBehaviorInterface {
  dataIncoming: (
    nodeId: string,
    handleId: string,
    dataType: PropagateDataType,
    data: any
  ) => void
  nodeProcess: (nodeId: string) => void
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
    // getNodeSnapshot<{
    //   imageBase64: string
    // }>(nodeId).data.imageBase64,
    getNodeSnapshot<{
      imageBuffer: Buffer
    }>(nodeId).data.imageBuffer,
} as HandleSource<Buffer>

export const propagateValue = (
  nodeId: string,
  handleSources: Record<string, HandleSource>
) => {
  const store = useNodeStore.getState()
  store.getOutgoingEdgesFromSourceNode(nodeId).forEach((edge) => {
    const targetNode = store.getNode(edge.target)
    if (!targetNode.type) {
      return
    }
    getNodeBehavior(targetNode.type).then((behavior) => {
      Object.values(handleSources).forEach((handleSource) => {
        if (!edge.targetHandle) {
          return
        }
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
