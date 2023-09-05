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
            if (state.count > 10) {
                console.log('process count over 10');
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
            if (!behavior.canStartProcess(node.id)) {
                return;
            }
            if (nodeStore.nodeGetCompleted(node.id)) {
                return;
            }
            nodeStore.nodeSetProcessing(node.id, true);
            behavior.nodeProcess(node.id, () => {
                console.log('process end', {
                    node: node.id,
                    type: node.type,
                });

                nodeStore.nodeSetProcessing(node.id, false);
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
