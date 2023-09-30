import { fs } from '@tauri-apps/api'
import Jimp from 'jimp'
import useNodeStore, { getNodeSnapshot } from '../../store/store'
import {
  NodeBaseData,
  NodeBaseDataImageBuffer,
  NodeBehaviorInterface,
  handleSourceImageDefault,
  handleSourceTextDefault,
  propagateValue,
} from './data/NodeData'

export const handleSources = {
  image: handleSourceImageDefault,
  filename: handleSourceTextDefault,
  directory: {
    id: 'directory',
    dataType: 'directory',
    propagateValue: (nodeId: string) =>
      getNodeSnapshot<{
        text: string
      }>(nodeId).data.text,
  },
}

export const handleTargets = {
  image: {
    id: 'image',
    dataType: 'image',
  },
  filename: {
    id: 'filename',
    dataType: 'text',
  },
  directory: {
    id: 'directory',
    dataType: 'directory',
  },
}

export type NodeData = {
  filename?: string
  directory?: string
  settings: {
    filename?: string
    directory?: string
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
    const node = getNodeSnapshot(nodeId)
    const store = useNodeStore.getState()
    switch (handleId) {
      case handleSources.image.id:
        store.updateNodeData<NodeData>(nodeId, {
          imageBuffer: data,
          completed: false,
        })
        break
      case handleSources.filename.id:
        store.updateNodeData<NodeData>(nodeId, {
          filename: data,
          completed: false,
        })
        break
      case handleSources.directory.id:
        store.updateNodeData<NodeData>(nodeId, {
          directory: data,
          completed: false,
        })
        break
    }
  },
  async nodeProcess(nodeId: string, callback: () => void): void {
    const store = useNodeStore.getState()
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    })
    let node = getNodeSnapshot<NodeData>(nodeId)

    const filename = node.data.filename || node.data.settings.filename
    const directory = node.data.directory || node.data.settings.directory

    if (node.data.imageBuffer?.buffer === undefined) {
      console.error('image buffer is undefined')
      return
    }
    // imageBuffer to jimp instance
    const jimpImage = await Jimp.read(node.data.imageBuffer?.buffer)

    // jimp instance to png
    const pngBuffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG)

    // log
    console.log('saving image to ' + `${directory}/${filename}`)
    await fs.writeBinaryFile(`${directory}/${filename}`, pngBuffer)
    console.log('saved image' + `${directory}/${filename}`)

    store.updateNodeData<NodeData>(nodeId, {
      completed: true,
    })
    callback()
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId)
    return (
      !!node.data.imageBuffer?.buffer &&
      !!(node.data.filename || node.data.settings.filename) &&
      !!(node.data.directory || node.data.settings.directory)
    )
  },
}
