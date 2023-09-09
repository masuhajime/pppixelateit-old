import { Fill00ColorToTransparentNode } from "./nodes/Fill00ColorToTransparentNode";
import { FillWithColorNode } from "./nodes/FillWithColorNode";
import { ImageInputNode } from "./nodes/ImageInputNode";
import { ImagePreviewNode } from "./nodes/ImagePreviewNode";
import { PixelateNode } from "./nodes/PixelateNode";
import { PosterizeNode } from "./nodes/PosterizeNode";
import { ResizeToSideNode } from "./nodes/ResizeToSideNode";
import { TestNode } from "./nodes/TestNode";
import { WhiteToBlackNode } from "./nodes/WhiteToBlackNode";

const nodeDefines = [
    {
        element: ImageInputNode,
    },
    {
        element: WhiteToBlackNode,
    },
    {
        element: ImagePreviewNode
    },
    {
        element: ResizeToSideNode
    },
    {
        element: PosterizeNode
    },
    {
        element: PixelateNode
    },
    {
        element: Fill00ColorToTransparentNode
    },
    {
        element: TestNode
    },
    {
        element: FillWithColorNode
    },
]

export const getNodeTypesForReactFlow = () => {
    const nodeTypes: { [k: string]: any } = {} = {};
    nodeDefines.forEach((node) => {
        nodeTypes[node.element.name] = node.element;
    })
    return nodeTypes;
}

export const getNodeTypes = () => {
    return nodeDefines.map((node) => {
        return {
            ...node,
            name: node.element.name,
        };
    })
}
