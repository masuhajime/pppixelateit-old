import processStore from "../store/processStore";
import useNodeStore, { RFState } from "../store/store";
import { NodeBehaviorInterface } from "../flows/nodes/data/NodeData";


// const nodeTypes = {
//     inputImage: ImageInputNode,
//     whiteToBlack: WhiteToBlackNode,
//     imagePreviewNode: ImagePreviewNode,
//   }

export const getNodeBehavior = async (type: string): Promise<NodeBehaviorInterface> => {
    switch (type) {
        case 'ImageInputNode':
            return await import(`../flows/nodes/ImageInputNodeBehavior`).then((module) => {
                return module.nodeBehavior;
            });
        case 'WhiteToBlackNode':
            return await import(`../flows/nodes/WhiteToBlackNodeBehavior`).then((module) => {
                return module.nodeBehavior;
            }
            );
        case 'ImagePreviewNode':
            return await import(`../flows/nodes/ImagePreviewNodeBehavior`).then((module) => {
                return module.nodeBehavior;
            }
            );
        case 'ResizeToSideNode':
            return await import(`../flows/nodes/ResizeToSideNodeBehavior`).then((module) => {
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
            if (node.type !== "ImageInputNode") {
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
