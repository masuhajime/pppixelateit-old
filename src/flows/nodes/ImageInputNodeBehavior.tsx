import { getNodeBehavior } from '../../process/imageProcess'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  HandleSource,
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

export type NodeData = {
  inputFile?: File
} & NodeBaseData &
  NodeBaseDataImageBuffer

export const nodeBehavior: NodeBehaviorInterface = {
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any
  ): void {
    throw new Error('node process: should not be incoming:' + nodeId)
  },
  nodeProcess(nodeId: string): void {
    const node = getNodeSnapshot<NodeData>(nodeId)
    // TODO: throw error is not image selected

    const store = useNodeStore.getState()
    store.updateNodeData<NodeData>(nodeId, {
      completed: true,
    })

    propagateValue(nodeId, handleSources)
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    console.log('canStartProcess ImageInput', {
      imageBase64: !!node.data.imageBuffer,
    })
    return !!node.data.imageBuffer
  },
}
