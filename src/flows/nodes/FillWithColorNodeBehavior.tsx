import { fillWithColorA, fillWithColorFromPoint } from '../../process/fillColor'
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
  colorTarget: {
    id: 'colorTarget',
    dataType: 'color',
  } as HandleTarget,
  colorFill: {
    id: 'colorFill',
    dataType: 'color',
  } as HandleTarget,
}

export type NodeDataSettings = {
  method: string
  r: number
  g: number
  b: number
  a: number
  r2: number
  g2: number
  b2: number
  a2: number
  tolerance: number
}
export type NodeData = {
  settings: NodeDataSettings
} & NodeBaseData &
  NodeBaseDataImageBuffer

const filter = (nodeData: NodeData): Promise<Buffer> => {
  if (!nodeData.imageBuffer?.buffer) {
    throw new Error('no image')
  }
  console.log('fill with color', nodeData.settings)

  if (nodeData.settings.method === 'top_left_pixel') {
    return fillWithColorFromPoint(
      nodeData.imageBuffer?.buffer,
      {
        x: 0,
        y: 0,
      },
      {
        r: nodeData.settings.r2,
        g: nodeData.settings.g2,
        b: nodeData.settings.b2,
        a: nodeData.settings.a2,
      },
      nodeData.settings.tolerance
    )
  } else {
    return fillWithColorA(
      nodeData.imageBuffer?.buffer,
      {
        r: nodeData.settings.r,
        g: nodeData.settings.g,
        b: nodeData.settings.b,
        a: nodeData.settings.a,
      },
      {
        r: nodeData.settings.r2,
        g: nodeData.settings.g2,
        b: nodeData.settings.b2,
        a: nodeData.settings.a2,
      },
      nodeData.settings.tolerance
    )
  }
}

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
    filter(node.data).then((w2b) => {
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
