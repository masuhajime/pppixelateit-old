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
} from 'reactflow';

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
        target: 'w2b',
        data: {
            label: 'edge label',
            onDelete: (id: string) => {
                // onEdgeDelete(id)
            },
        },
        type: 'custom',
    },
    {
        id: 'e1-2a',
        source: 'w2b',
        target: 'ipn',
        data: {
            label: 'edge label',
            onDelete: (id: string) => {
                // onEdgeDelete(id)
            },
        },
        type: 'custom',
    },
] as Edge[];

export type NodeData = {
    color: string;
};

export type RFState = {
    nodes: Node<NodeData>[];
    edges: Edge[];
    nodeAdd: (node: Node) => void;
    edgeDelete: (edgeId: string) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    updateNodeColor: (nodeId: string, color: string) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
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
}));

export default useStore;