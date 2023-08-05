import { shallow } from "zustand/shallow";
import processStore from "../store/processStore";
import useNodeStore, { RFState } from "../store/store";
import { Node } from "reactflow";
import { NodeBehaviorInterface } from "../flows/nodes/data/NodeData";


// const nodeTypes = {
//     inputImage: ImageInputNode,
//     whiteToBlack: WhiteToBlackNode,
//     imagePreviewNode: ImagePreviewNode,
//   }

export const getNodeBehavior = async (type: string): Promise<NodeBehaviorInterface> => {
    switch (type) {
        case 'inputImage':
            return await import(`../flows/nodes/ImageInputNode`).then((module) => {
                return module.nodeBehavior;
            });
        case 'whiteToBlack':
            return await import(`../flows/nodes/WhiteToBlackNode`).then((module) => {
                return module.nodeBehavior;
            }
            );
        case 'imagePreviewNode':
            return await import(`../flows/nodes/ImagePreviewNode`).then((module) => {
                return module.nodeBehavior;
            }
            );
        default:
            throw new Error(`Node type ${type} not found`);
    }
}

class ProcessController {
    async start() {
        processStore.getState().start();

        useNodeStore.getState().nodes.map(async (node) => {
            if (node.type === undefined) {
                return;
            }
            const behavior = await getNodeBehavior(node.type);
            behavior.nodeProcess(node.id);
        });
    }

    progress() {
        processStore.getState().progress();
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
