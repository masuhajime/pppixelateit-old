import { create } from 'zustand';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
    getOutgoers,
} from 'reactflow';
import { getNodeBehavior } from '../process/process';

const initialNodes = [
    {
        id: 'node-1',
        type: 'inputImage',
        position: { x: 0, y: 100 },
        data: { label: '3' },
    },
    {
        id: 'w2b',
        type: 'whiteToBlack',
        position: { x: 300, y: 100 },
        data: { label: '3' },
    },
    {
        id: 'ipn',
        type: 'imagePreviewNode',
        position: { x: 600, y: 100 },
        data: { label: '3' },
    },
] as Node[]
const initialEdges = [
    {
        id: 'e1-2',
        source: 'node-1',
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

export type RFState = {
    nodes: Node[];
    edges: Edge[];
    getNodeTargetedFrom: (nodeId: string) => Node[];
    nodeAdd: (node: Node) => void;
    edgeDelete: (edgeId: string) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateNodeColor: (nodeId: string, color: string) => void;
    updateNodeData: <T = any>(nodeId: string, data: Partial<T>) => void;
    getNode(nodeId: string): Node;
    getOutgoingEdgesFromSourceNode(sourceNodeId: string): Edge[];
    setNodeProcessingStart(nodeId: string): void;
    setNodeProcessingComplete(nodeId: string): void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useNodeStore = create<RFState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    updateNodeData<T = any>(nodeId: string, data: T) {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    // it's important to create a new object here, to inform React Flow about the cahnges
                    node.data = { ...node.data, ...data };
                }
                return node;
            }),
        });
    },
    getNode(nodeId: string): Node {
        const node = get().nodes.find((node) => node.id === nodeId);
        if (!node) throw new Error('node not found');
        return node as Node;
    },
    getOutgoingEdgesFromSourceNode(sourceNodeId: string): Edge[] {
        return get().edges
            .filter((edge) => edge.source === sourceNodeId);
    },
    getNodeTargetedFrom(nodeId: string): Node[] {
        const nodeFrom = get().nodes.find((node) => node.id === nodeId);
        if (!nodeFrom) throw new Error('node not found');
        return getOutgoers(nodeFrom, get().nodes, get().edges);
    },
    nodeAdd: (node: Node) => {
        set({
            nodes: [...get().nodes, node]
        })
    },
    edgeDelete: (edgeId: string) => {
        set({
            edges: get().edges.filter((edge) => edge.id !== edgeId)
        })
    },
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },
    updateNodeColor: (nodeId: string, color: string) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    // it's important to create a new object here, to inform React Flow about the cahnges
                    node.data = { ...node.data, color };
                }
                return node;
            }),
        });
    },
    setNodeProcessingStart: (nodeId: string) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    node.data = { ...node.data, processing: true };
                }
                return node;
            }),
        });
    },
    setNodeProcessingComplete: (nodeId: string) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    node.data = { ...node.data, processing: false };
                }
                return node;
            }),
        });
    },
}));

export const getNodeSnapshot = (nodeId: string) => useNodeStore.getState().getNode(nodeId)

export default useNodeStore;