import { resizeBaseOn } from '../../process/w2b'
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

export type NodeData = {
  settings: {
    size?: number
    resizeBase?: string
    method?: string
  }
} & NodeBaseData &
  NodeBaseDataImageBuffer

export const nodeBehavior: NodeBehaviorInterface = {
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any
  ): void {
    const store = useNodeStore.getState()
    store.updateNodeData(nodeId, {
      imageBuffer: data,
    })
    // if (this.canStartProcess(node.id)) {
    //   this.nodeProcess(node.id)
    // }
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    const store = useNodeStore.getState()
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    })
    let node = getNodeSnapshot<NodeData>(nodeId)
    //data.completed = true
    console.log(
      'node process resize to:',
      //node.data.imageBase64,
      node.id,
      node.type
    )

    if (
      !node.data.imageBuffer ||
      !node.data.settings.size ||
      !node.data.settings.resizeBase ||
      !node.data.settings.method
    ) {
      return
    }

    resizeBaseOn(
      node.data.imageBuffer,
      node.data.settings.resizeBase,
      node.data.settings.size,
      node.data.settings.method
    ).then((w2b) => {
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
    console.log(
      'canStartProcess Resize:',
      !!node.data.imageBuffer &&
        !!node.data.settings.size &&
        !!node.data.settings.resizeBase &&
        !!node.data.settings.method,
      {
        imageBuffer: !!node.data.imageBuffer,
        method: node.data.settings.method,
        size: node.data.settings.size,
        resizeBase: node.data.settings.resizeBase,
      }
    )

    return (
      !!node.data.imageBuffer &&
      !!node.data.settings.size &&
      !!node.data.settings.resizeBase &&
      !!node.data.settings.method
    )
  },
}
