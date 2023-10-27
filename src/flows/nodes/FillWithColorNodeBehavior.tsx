import { fillWithColor } from '../../process/w2b'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  HandleTarget,
  NodeBaseData,
  NodeBaseDataImageBuffer,
  NodeBehaviorInterface,
  handleSourceImageDefault,
  propagateValue,
} from './data/NodeData'

export const handleSources = {
  image: handleSourceImageDefault,
}

export const handleTargets = {
  image: {
    id: 'image',
    dataType: 'image',
  } as HandleTarget,
  tolerance: {
    id: 'tolerance',
    dataType: 'number',
  } as HandleTarget,
  x: {
    id: 'x',
    dataType: 'number',
  } as HandleTarget,
  y: {
    id: 'y',
    dataType: 'number',
  } as HandleTarget,
  color: {
    id: 'color',
    dataType: 'color',
  } as HandleTarget,
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
      completed: false,
    })
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    let node = getNodeSnapshot<NodeData>(nodeId)

    if (!node.data.imageBuffer?.buffer) {
      throw new Error('no image')
    }

    const store = useNodeStore.getState()
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    })
    fillWithColor(
      node.data.imageBuffer?.buffer,
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
        imageBuffer: {
          buffer: w2b,
          end: true,
        },
      })

      propagateValue(nodeId, handleSources)
      callback()
    })
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    return !!node.data.imageBuffer?.buffer // && !!node.data.settings.number
  },
}
