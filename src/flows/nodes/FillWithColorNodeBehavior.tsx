import { getNodeBehavior } from '../../process/imageProcess'
import { fill00ColorToTransparent, fillWithColor } from '../../process/w2b'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  HandleSource,
  HandleTarget,
  NodeBaseData,
  NodeBaseDataImageBase64,
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
  tolerance: {
    id: 'tolerance',
    dataType: 'number',
  },
  x: {
    id: 'x',
    dataType: 'number',
  },
  y: {
    id: 'y',
    dataType: 'number',
  },
  r: {
    id: 'r',
    dataType: 'number',
  },
  g: {
    id: 'r',
    dataType: 'number',
  },
  b: {
    id: 'r',
    dataType: 'number',
  },
  a: {
    id: 'r',
    dataType: 'number',
  },
}

export type NodeDataSettings = {
  x: number
  y: number
  r: number
  g: number
  b: number
  a: number
  tolerance: number
}
export type NodeData = {
  settings: NodeDataSettings
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
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    let node = getNodeSnapshot<NodeData>(nodeId)

    if (!node.data.imageBuffer) {
      throw new Error('no image')
    }

    const store = useNodeStore.getState()
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    })
    fillWithColor(
      node.data.imageBuffer,
      {
        x: node.data.settings.x,
        y: node.data.settings.y,
      },
      {
        r: node.data.settings.r,
        g: node.data.settings.g,
        b: node.data.settings.b,
        a: node.data.settings.a,
      },
      node.data.settings.tolerance
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
    return !!node.data.imageBuffer // && !!node.data.settings.number
  },
}
