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
        id: 'resize',
        type: 'ResizeToSideNode',
        position: { x: 300, y: 100 },
        data: {}
    },
    {
        id: 'w2b',
        type: 'WhiteToBlackNode',
        position: { x: 600, y: 100 },
        data: {}
    },
    {
        id: 'ipn',
        type: 'ImagePreviewNode',
        position: { x: 900, y: 100 },
        data: {}
    },
] as Node[]
export const initialEdges = [
    {
        id: 'e1-2',
        source: 'node-1',
        sourceHandle: 'image',
        target: 'resize',
        targetHandle: 'image',
        data: {
        },
        type: 'custom',
    },
    {
        id: 'e1-2bbb',
        source: 'resize',
        sourceHandle: 'image',
        target: 'w2b',
        targetHandle: 'image',
        data: {
        },
        type: 'custom',
    },
    {
        id: 'e1-2a',
        source: 'w2b',
        sourceHandle: 'image',
        target: 'ipn',
        targetHandle: 'image',
        data: {
        },
        type: 'custom',
    },
] as Edge[];
