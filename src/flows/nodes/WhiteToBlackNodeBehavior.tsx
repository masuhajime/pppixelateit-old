import { getNodeBehavior } from '../../process/imageProcess'
import { greyscale } from '../../process/w2b'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  HandleSource,
  HandleTarget,
  NodeBaseData,
  NodeBehaviorInterface,
  handleSourceImageDefault,
  propagateValue,
} from './data/NodeData'

export const handleSources: Record<string, HandleSource> = {
  image: handleSourceImageDefault,
}

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
    console.log('dataIncoming:', nodeId, handleId, dataType)

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
      imageBase64: w2b,
    })

    propagateValue(nodeId, handleSources)
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    return !!node.data.imageBase64
  },
}
