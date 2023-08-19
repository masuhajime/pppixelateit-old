import { getNodeBehavior } from '../../process/imageProcess'
import { fill00ColorToTransparent } from '../../process/w2b'
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

export const handleTargets: Record<string, HandleTarget> = {
  image: {
    id: 'image',
    type: 'image',
  },
}

export type NodeData = {
  imageBase64?: string
  // number?: number
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

    if (!node.data.imageBase64) {
      throw new Error('no image')
    }

    const store = useNodeStore.getState()
    fill00ColorToTransparent(node.data.imageBase64).then((w2b) => {
      store.updateNodeData(nodeId, {
        ...node.data,
        imageBase64: w2b,
      })

      node = getNodeSnapshot(nodeId)
      store.getOutgoingEdgesFromSourceNode(node.id).forEach((edge) => {
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
    })
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    return !!node.data.imageBase64 // && !!node.data.settings.number
  },
}

const denoise0 = () => {
  // image
  //     .color([{apply: 'desaturate', params: [90]}])
  //     .contrast(1)
  //     .write("img-opt.jpg");
}
const denoise1 = () => {
  // image.gaussian(15);
}
