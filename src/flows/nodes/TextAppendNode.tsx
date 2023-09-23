import { NodeProps } from 'reactflow'

import useNodeStore, { updateSetting } from '../../store/store'
import {
  NodeData,
  handleSources,
  handleTargets,
} from './TextAppendNodeBehavior'
import { Node } from './components/Node'
import { NodeContent } from './components/NodeContent'
import { NodeHeader } from './components/NodeHeader'
import { HandleSourceImage } from './items/HandleSourceImage'
import { HandleTargetImage } from './items/HandleTargetImage'
import { HandleTargetNumber } from './items/HandleTargetNumber'
import { ImagePreview } from './items/ImagePreview'
import { Separator } from './items/Separator'
import { NodeStatus } from './components/NodeStatus'
import { HandleTargetText } from './items/HandleTargetText'
import { HandleSourceText } from './items/HandleSourceText'

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
        <NodeStatus processTime={data.processTime}></NodeStatus>
      </NodeContent>
    </Node>
  )
}
