import { NodeBehaviorInterface } from "../flows/nodes/data/NodeData";
import processStore from "../store/processStore";
import useNodeStore from "../store/store";

export const getNodeBehavior = async (type: string): Promise<NodeBehaviorInterface> => {
    return await import(`../flows/nodes/${type}Behavior.tsx`).then((module) => {
        return module.nodeBehavior;
    });
}

class ProcessController {
    async start() {
        const nodeStore = useNodeStore.getState();
        nodeStore.nodeSetAllUncompleted();
        nodeStore.nodeAllCleareBuffer();
        processStore.getState().start();

        const unsubscribe = processStore.subscribe((state) => {
            console.log('process status', state.count, state.processStatus);

            if (state.processStatus != 'processing') {
                unsubscribe();
            }
            if (this.checkCanStartProcess()) {
                this.progress();
            } else {
                this.stop();
            }

            // debug
            const limit = 50;
            if (state.count > limit) {
                console.log('######### process count over ' + limit);
                this.stop();
            }
        });

        this.progress();
    }

    progress() {
        const nodeStore = useNodeStore.getState();
        nodeStore.nodes.forEach(async (node) => {
            if (node.type === undefined) {
                return;
            }
            const behavior = await getNodeBehavior(node.type);
            if (nodeStore.nodeGetCompleted(node.id)) {
                return;
            }
            if (nodeStore.nodeGetProcessing(node.id)) {
                return;
            }
            if (!behavior.canStartProcess(node.id)) {
                return;
            }
            nodeStore.nodeSetProcessing(node.id, true);
            // start date
            const start = new Date();
            behavior.nodeProcess(node.id, () => {
                console.log('process end', {
                    node: node.id,
                    type: node.type,
                });

                // end date
                const end = new Date();
                const diff = end.getTime() - start.getTime();
                nodeStore.updateNodeData(node.id, {
                    isProcessing: false,
                    processTime: diff,
                });
                processStore.getState().progress();
            });
        });
    }

    checkCanStartProcess(): boolean {
        return useNodeStore.getState().nodes.some(async (node) => {
            if (node.type === undefined) {
                return false;
            }
            if (useNodeStore.getState().nodeGetCompleted(node.id)) {
                return false;
            }
            const behavior = await getNodeBehavior(node.type);
            return behavior.canStartProcess(node.id);
        });
    }

    stop() {
        processStore.getState().stop();
    }

    reset() {
        processStore.getState().reset();
    }
}
const processController = new ProcessController();
export default processController;
