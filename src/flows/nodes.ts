import { Fill00ColorToTransparentNode } from "./nodes/Fill00ColorToTransparentNode";
import { FillWithColorNode } from "./nodes/FillWithColorNode";
import { ImageInputNode } from "./nodes/ImageInputNode";
import { ImagePreviewCompare } from "./nodes/ImagePreviewCompare";
import { ImagePreviewNode } from "./nodes/ImagePreviewNode";
import { OutlineNode } from "./nodes/OutlineNode";
import { PixelateNode } from "./nodes/PixelateNode";
import { PosterizeNode } from "./nodes/PosterizeNode";
import { RemoveEdgePixelNode } from "./nodes/RemoveEdgePixelNode";
import { ResizeToSideNode } from "./nodes/ResizeToSideNode";
import { SaveImageNode } from "./nodes/SaveImageNode";
import { TestNode } from "./nodes/TestNode";
import { TextAppendNode } from "./nodes/TextAppendNode";
import { TextFileNameNode } from "./nodes/TextFileNameNode";
import { WhiteToBlackNode } from "./nodes/WhiteToBlackNode";

const nodeDefines = [
    {
        element: TextAppendNode,
    },
    {
        element: TextFileNameNode,
    },
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
    {
        element: RemoveEdgePixelNode
    },
    {
        element: OutlineNode
    },
    {
        element: ImagePreviewCompare
    },
    {
        element: SaveImageNode
    }
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
