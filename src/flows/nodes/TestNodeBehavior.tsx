import { getNodeBehavior } from '../../process/imageProcess'
import { opencv2, outlinePaint } from '../../process/w2b'
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
    const node = getNodeSnapshot(nodeId)
    const store = useNodeStore.getState()
    store.updateNodeData(nodeId, {
      ...node.data,
      imageBase64: data,
    })
    if (this.canStartProcess(node.id)) {
      this.nodeProcess(node.id)
    }
  },
  nodeProcess(nodeId: string): void {
    let node = getNodeSnapshot<NodeData>(nodeId)
    //data.completed = true
    console.log('node process resize to:', node.id, node.type)

    if (!node.data.imageBase64) {
      throw new Error('no image data')
    }

    const store = useNodeStore.getState()

    opencv2(node.data.imageBase64).then((w2b) => {
      store.updateNodeData(nodeId, {
        imageBase64: w2b,
      })

      propagateValue(nodeId, handleSources)
    })
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    return !!node.data.imageBase64
  },
}
