
import { getNodeBehavior } from '../../process/imageProcess'
import { filterw2b } from '../../process/w2b'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  HandleTarget,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData'

export const handleSources: Record<string, HandleTarget> = {
  image: {
    id: 'image',
    type: 'image',
  },
}

export type NodeData = {
  imageBase64?: string
  inputFile?: File
  completed?: boolean
} & NodeBaseData

export const nodeBehavior: NodeBehaviorInterface = {
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any
  ): void {
    console.error('node process: should not be incoming', nodeId)
  },
  nodeProcess(nodeId: string): void {
    const node = getNodeSnapshot(nodeId)
    //data.completed = true
    console.log('node process:', node.id, node.type)

    // console.log('aaaaaaaaaaaa')
    // const sharp = import('sharp')
    // console.log('bbbbbbbbbbbb')

    const store = useNodeStore.getState()

    store.getOutgoingEdgesFromSourceNode(node.id).forEach((edge) => {
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
