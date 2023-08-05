import { Node } from 'reactflow'

export type IncomingDataType = 'image' | 'number'

export type NodeBaseData = {
  isProcessing: boolean
}

export interface NodeBehaviorInterface {
  dataIncoming: (
    nodeId: string,
    handleId: string,
    dataType: IncomingDataType,
    data: any
  ) => void
  nodeProcess: (nodeId: string) => void
  canStartProcess(nodeId: string): boolean
}

export type HandleTarget = {
  id: string
  type: string
}
