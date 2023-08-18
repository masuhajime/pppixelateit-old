import {
    Edge,
    Node
} from 'reactflow';

export const initialNodes = [
    {
        id: 'node-1',
        type: 'ImageInputNode',
        position: { x: 0, y: 100 },
        data: {}
    },
    {
        id: 'fill00',
        type: 'Fill00ColorToTransparentNode',
        position: { x: 300, y: 100 },
        data: {}
    }
] as Node[]
export const initialEdges = [
    {
        id: 'e1-2',
        source: 'node-1',
        sourceHandle: 'image',
        target: 'fill00',
        targetHandle: 'image',
        data: {
        },
        type: 'custom',
    }
] as Edge[];
