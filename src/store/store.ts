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
import { NodeBaseData, NodeBaseDataSettings } from '../flows/nodes/data/NodeData';

export type RFState = {
    nodes: Node[];
    edges: Edge[];
    getNodeTargetedFrom: (nodeId: string) => Node[];
    updateNodeData: <T = NodeBaseData>(nodeId: string, data: Partial<T>) => void;
    updateNodeSetting: <T = NodeBaseDataSettings>(nodeId: string, settings: T) => void;
    getNode<T = NodeBaseData>(nodeId: string): Node<T>;
    edgeDelete: (edgeId: string) => void;
    getOutgoingEdgesFromSourceNode(sourceNodeId: string): Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    nodeAdd: (node: Node) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useNodeStore = create(
    persist(
        (set, get: () => RFState) => {
            return ({
                nodes: initialNodes,
                edges: initialEdges,
                getNodeTargetedFrom(nodeId: string): Node[] {
                    const nodeFrom = get().nodes.find((node) => node.id === nodeId);
                    if (!nodeFrom) throw new Error('node not found');
                    return getOutgoers(nodeFrom, get().nodes, get().edges);
                },
                updateNodeData<T = NodeBaseData>(nodeId: string, data: T) {
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
                updateNodeSetting<T = NodeBaseDataSettings>(nodeId: string, settings: T) {
                    set({
                        nodes: get().nodes.map((node) => {
                            if (node.id === nodeId) {
                                const newSettings = { ...node.data.settings, ...settings };
                                node.data = { ...node.data, settings: newSettings };
                            }
                            return node;
                        }),
                    });
                },
                getNode<T = NodeBaseData>(nodeId: string): Node<T> {
                    const node = get().nodes.find((node) => node.id === nodeId);
                    if (!node) throw new Error('node not found');
                    return node as Node;
                },
                edgeDelete: (edgeId: string) => {
                    set({
                        edges: get().edges.filter((edge) => edge.id !== edgeId)
                    })
                },
                getOutgoingEdgesFromSourceNode(sourceNodeId: string): Edge[] {
                    return get().edges
                        .filter((edge) => edge.source === sourceNodeId);
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
                nodeAdd: (node: Node) => {
                    set({
                        nodes: [...get().nodes, node]
                    })
                },
            });
        },
        {
            name: 'node-edge-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => {
                const objects: Partial<RFState> =
                    Object.fromEntries(
                        Object.entries(state)
                            .filter(([key]) => {
                                return ['nodes', 'edges'].includes(key)
                            })
                    );

                //remove keys in edges.data without "settings" key in objects.nodes
                objects.nodes = (objects.nodes || []).map((node) => {
                    if (node.type === 'ImageInputNode') return node;
                    const newNode = { ...node };
                    if (node.data && node.data.settings) {
                        const settings = { ...node.data.settings };
                        newNode.data = { settings };
                    } else {
                        newNode.data = { settings: {} };
                    }
                    return newNode;
                });

                return objects;
            },
            onRehydrateStorage: (state) => {
                console.log('hydration starts')
                // optional
                return (state, error) => {
                    if (error) {
                        console.log('an error happened during hydration', error)
                    } else {
                        console.log('hydration finished')
                    }
                }
            },
            // store data partialize https://docs.pmnd.rs/zustand/integrations/persisting-store-data
        }
    )
);

export const getNodeSnapshot = <T = NodeBaseData>(nodeId: string) => useNodeStore.getState().getNode<T>(nodeId)

export default useNodeStore;