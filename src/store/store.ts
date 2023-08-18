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
import { initialEdges, initialNodes } from './initialNodesTransparent';
import { createJSONStorage, persist } from 'zustand/middleware';


export type RFStateA = {
    bears: number;
}

export const useBearStore = create(
    persist(
        (set, get: () => RFStateA) => ({
            bears: 0,
            addABear: () => set({ bears: get().bears + 1 }),
        }),
        {
            name: 'food-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
)


export type RFState = {
    nodes: Node[];
    edges: Edge[];
    getNodeTargetedFrom: (nodeId: string) => Node[];
    nodeAdd: (node: Node) => void;
    edgeDelete: (edgeId: string) => void;
    updateNodeData: <T = any>(nodeId: string, data: Partial<T>) => void;
    getNode(nodeId: string): Node;
    getOutgoingEdgesFromSourceNode(sourceNodeId: string): Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useNodeStore = create(
    persist(
        (set, get: () => RFState) => ({
            nodes: initialNodes,
            edges: initialEdges,
            getNodeTargetedFrom(nodeId: string): Node[] {
                const nodeFrom = get().nodes.find((node) => node.id === nodeId);
                if (!nodeFrom) throw new Error('node not found');
                return getOutgoers(nodeFrom, get().nodes, get().edges);
            },
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
        }),
        {
            name: 'reactflow-state',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => {
                return Object.fromEntries(
                    Object.entries(state).filter(([key]) => !['foo'].includes(key))
                );
            }
            // store data partialize https://docs.pmnd.rs/zustand/integrations/persisting-store-data
        }
    )
);

export const getNodeSnapshot = (nodeId: string) => useNodeStore.getState().getNode(nodeId)

export default useNodeStore;