import { getNodeBehavior } from '../../process/imageProcess'
import { getBufferFromBase64 } from '../../process/w2b'
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
  nodeProcess(nodeId: string, callback: () => void): void {
    const node = getNodeSnapshot<NodeData>(nodeId)
    // TODO: throw error is not image selected

    const nodeStore = useNodeStore.getState()

    if (!node.data.inputFile) {
      throw new Error('no image')
    }
    const reader = new FileReader()
    reader.onload = () => {
      const buffer = getBufferFromBase64(reader.result as string)
      nodeStore.updateNodeData<NodeData>(node.id, {
        imageBuffer: buffer,
      })
      propagateValue(nodeId, handleSources)
      callback()
    }
    reader.readAsDataURL(node.data.inputFile)

    nodeStore.updateNodeData<NodeData>(nodeId, {
      completed: true,
    })
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    console.log('canStartProcess ImageInput', {
      imageBase64: !!node.data.imageBuffer,
      inputFile: node.data.inputFile,
    })
    return !!node.data.inputFile
  },
}
