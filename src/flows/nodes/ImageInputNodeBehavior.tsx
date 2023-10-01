import { fs } from '@tauri-apps/api'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  HandleSource,
  NodeBaseData,
  NodeBaseDataImageBuffer,
  NodeBehaviorInterface,
  handleSourceImageDefault,
  propagateValue,
} from './data/NodeData'
import { Buffer } from 'buffer'
import path from 'path'

export const handleSources = {
  image: handleSourceImageDefault,
  directory: {
    id: 'directory',
    dataType: 'directory',
    propagateValue: (nodeId: string) => {
      const node = getNodeSnapshot<NodeData>(nodeId)
      if (!node.data.inputFilePath) {
        throw new Error('no image')
      }
      return path.dirname(node.data.inputFilePath)
    },
  } as HandleSource,
  filename: {
    id: 'filename',
    dataType: 'text',
    propagateValue: (nodeId: string) => {
      const node = getNodeSnapshot<NodeData>(nodeId)
      if (!node.data.inputFilePath) {
        throw new Error('no image')
      }
      return path.basename(node.data.inputFilePath)
    },
  } as HandleSource,
}

export type NodeData = {
  inputFilePath?: string
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

    if (!node.data.inputFilePath) {
      throw new Error('no image')
    }

    fs.readBinaryFile(node.data.inputFilePath).then((buffer) => {
      nodeStore.updateNodeData<NodeData>(nodeId, {
        imageBuffer: {
          buffer: Buffer.from(buffer),
          end: true,
        },
        completed: true,
      })
      propagateValue(nodeId, handleSources)
      callback()
    })
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    return !!node.data.inputFilePath
  },
}
