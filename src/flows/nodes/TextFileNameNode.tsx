import { NodeProps } from 'reactflow'

import useNodeStore from '../../store/store'
import {
  NodeData,
  handleSources,
  handleTargets,
} from './TextFileNameNodeBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { NodeStatus } from './components/NodeStatus'
import { HandleSourceText } from './items/HandleSourceText'
import { HandleTargetText } from './items/HandleTargetText'

export const TextFileNameNode = ({ id, data }: NodeProps<NodeData>) => {
  const store = useNodeStore.getState()
  const node = store.getNode<NodeData>(id)
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="File Name" />
      <NodeContent>
        <HandleTargetText
          name="Text Input"
          handleId={handleTargets.text.id}
          nodeId={id}
          defaultValue={''}
          disableInput={true}
        ></HandleTargetText>
        <HandleSourceText
          handleId={handleSources.text.id}
          label="Text"
          nodeId={id}
        ></HandleSourceText>
        <NodeStatus processTime={data.processTime}></NodeStatus>
      </NodeContent>
    </Node>
  )
}
