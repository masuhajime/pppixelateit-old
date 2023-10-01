import { fs } from '@tauri-apps/api'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  HandleSource,
  NodeBaseData,
  NodeBaseDataImageBuffer,
  NodeBehaviorInterface,
  createNodeBehavior,
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
      if (!node.data.inputDirectoryPath) {
        throw new Error('no directory')
      }
      return node.data.inputDirectoryPath
    },
  } as HandleSource,
  filename: {
    id: 'filename',
    dataType: 'text',
    propagateValue: (nodeId: string) => {
      const node = getNodeSnapshot<NodeData>(nodeId)
      if (!node.data.filename) {
        throw new Error('no image')
      }
      return node.data.filename
    },
  } as HandleSource,
}

export type NodeData = {
  inputDirectoryPath?: string
  inputFilePaths?: string[]
  inputFilePathsPointer?: number
  filename?: string
} & NodeBaseData &
  NodeBaseDataImageBuffer

export const nodeBehavior: NodeBehaviorInterface = createNodeBehavior({
  async initialize(nodeId) {
    const store = useNodeStore.getState()

    console.log('initialize: ' + nodeId)
    const node = getNodeSnapshot<NodeData>(nodeId)
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    })
    if (!node.data.inputDirectoryPath) {
      throw new Error('no directory')
    }
    const files = await fs.readDir(node.data.inputDirectoryPath)
    const filePaths = files.map((file) => {
      return file.path
    })
    store.updateNodeData<NodeData>(nodeId, {
      inputFilePaths: filePaths,
      inputFilePathsPointer: 0,
    })
    // log
    console.log('Image input dir files', filePaths)
  },
  async nodeProcess(nodeId: string, callback: () => void): Promise<void> {
    console.log('process: ' + nodeId)

    const node = getNodeSnapshot<NodeData>(nodeId)

    const nodeStore = useNodeStore.getState()

    if (
      !node.data.inputFilePaths ||
      node.data.inputFilePathsPointer === undefined
    ) {
      throw new Error('no directory')
    }

    const currentFile =
      node.data.inputFilePaths[node.data.inputFilePathsPointer]
    if (!currentFile) {
      throw new Error('no file')
    }
    const isEnd = !node.data.inputFilePaths[node.data.inputFilePathsPointer + 1]

    const buffer = await fs.readBinaryFile(currentFile)
    console.log('image input dir process, set buffer', {
      currentFile,
      current: node.data.inputFilePathsPointer,
      next: node.data.inputFilePathsPointer + 1,
    })
    nodeStore.updateNodeData<NodeData>(nodeId, {
      imageBuffer: {
        buffer: Buffer.from(buffer),
        end: isEnd,
      },
      filename: path.basename(currentFile),
      inputFilePathsPointer: node.data.inputFilePathsPointer + 1,
      completed: true,
    })
    propagateValue(nodeId, handleSources)
    callback()
  },
  hasNextIteration(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)

    if (!node.data.inputFilePaths || !node.data.inputFilePathsPointer) {
      throw new Error('no directory 4')
    }
    const currentFile =
      node.data.inputFilePaths[node.data.inputFilePathsPointer]
    return !!currentFile
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    console.log('canStartProcess: ', {
      nodeId: nodeId,
      can: !!node.data.inputFilePaths,
      inputFilePaths: node.data.inputFilePaths,
    })

    return !!node.data.inputFilePaths
  },
})
