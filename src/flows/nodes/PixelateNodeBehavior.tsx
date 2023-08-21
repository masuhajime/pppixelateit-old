import { getNodeBehavior } from '../../process/imageProcess'
import { pixelate } from '../../process/w2b'
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
  settings: {
    number?: number
  }
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
    console.log(
      'node process resize to:',
      //node.data.imageBase64,
      node.id,
      node.type
    )
    if (!node.data.imageBase64 || !node.data.settings.number) {
      throw new Error('no image or number')
    }

    const store = useNodeStore.getState()
    pixelate(node.data.imageBase64, node.data.settings.number).then((w2b) => {
      store.updateNodeData(nodeId, {
        imageBase64: w2b,
      })

      propagateValue(nodeId, handleSources)
    })
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    return !!node.data.imageBase64 && !!node.data.settings.number
  },
}
