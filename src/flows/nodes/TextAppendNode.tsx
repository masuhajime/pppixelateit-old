import { NodeProps } from 'reactflow'

import { updateSetting } from '../../store/store'
import {
  NodeData,
  handleSources,
  handleTargets,
} from './TextAppendNodeBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { NodeStatus } from './components/NodeStatus'
import { HandleSourceText } from './items/HandleSourceText'
import { HandleTargetText } from './items/HandleTargetText'
import { Separator } from './items/Separator'

export const TextAppendNode = ({ id, data }: NodeProps<NodeData>) => {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="Text Append" />
      <NodeContent>
        <HandleTargetText
          name="Text"
          handleId={handleTargets.text.id}
          nodeId={id}
          defaultValue={data.settings.text || ''}
          onChange={updateSetting(id, 'text')}
        ></HandleTargetText>
        <HandleTargetText
          name="Append text"
          handleId={handleTargets.append.id}
          nodeId={id}
          defaultValue={data.settings.append || ''}
          onChange={updateSetting(id, 'append')}
        ></HandleTargetText>
        <HandleSourceText
          handleId={handleSources.text.id}
          label="Text"
          nodeId={id}
        ></HandleSourceText>
        <Separator />
        <NodeStatus nodeData={data}></NodeStatus>
      </NodeContent>
    </Node>
  )
}
