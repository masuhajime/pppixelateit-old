import { getNodeBehavior } from '../../process/imageProcess'
import { greyscale } from '../../process/w2b'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  HandleTarget,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData'

export const handleTargets: Record<string, HandleTarget> = {
  image: {
    id: 'image',
    type: 'image',
  },
}

export const handleSources = {
  image: {
    id: 'image',
    type: 'image',
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
  async nodeProcess(nodeId: string): Promise<void> {
    let node = getNodeSnapshot<NodeData>(nodeId)
    if (!this.canStartProcess(node.id)) {
      return
    }
    console.log('node process:', node.id, node.type)

    const store = useNodeStore.getState()

    if (!node.data.imageBase64) {
      throw new Error('no image data')
    }

    const w2b = await greyscale(node.data.imageBase64)

    store.updateNodeData(nodeId, {
      ...node.data,
      imageBase64: w2b,
    })

    node = getNodeSnapshot<NodeData>(nodeId)

    store.getOutgoingEdgesFromSourceNode(nodeId).forEach((edge) => {
      console.log('edge', edge)

      const targetNode = store.getNode(edge.target)
      if (!targetNode.type) {
        return
      }

      getNodeBehavior(targetNode.type).then((behavior) => {
        console.log('behavior', targetNode.type)
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
    const node = getNodeSnapshot<NodeData>(nodeId)
    return !!node.data.imageBase64
  },
}
