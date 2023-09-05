import { greyscale } from '../../process/w2b'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  HandleSource,
  HandleTarget,
  NodeBaseData,
  NodeBaseDataImageBuffer,
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

export type NodeData = {} & NodeBaseData & NodeBaseDataImageBuffer

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
      imageBuffer: data,
    })
    console.log('node', store.getNode(nodeId))

    // if (this.canStartProcess(node.id)) {
    //   this.nodeProcess(node.id)
    // }
  },
  async nodeProcess(nodeId: string, callback: () => void): Promise<void> {
    let node = getNodeSnapshot<NodeData>(nodeId)
    if (!this.canStartProcess(node.id)) {
      return
    }
    const store = useNodeStore.getState()
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    })
    console.log('node process:', node.id, node.type)

    if (!node.data.imageBuffer) {
      throw new Error('no image data')
    }

    greyscale(node.data.imageBuffer).then((w2b) => {
      store.updateNodeData<NodeData>(nodeId, {
        completed: true,
        imageBuffer: w2b,
      })
      propagateValue(nodeId, handleSources)
      callback()
    })
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    return !!node.data.imageBuffer
  },
}
