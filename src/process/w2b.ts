import { Buffer } from "buffer"
import Jimp from "jimp"

export const greyscale = async (base64: string) => {

    let url = base64.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(url, 'base64');

    let img = await Jimp.read(buffer);
    img.greyscale();
    return await img.getBase64Async(Jimp.AUTO);
}

type ResizeMethod =
    | "nearestNeighbor"
    | "bilinearInterpolation"
    | "bicubicInterpolation"
    | "hermiteInterpolation"
    | "bezierInterpolation";
export const resizeSize = async (base64: string, side: 'width' | 'height', size: number, method: ResizeMethod) => {

    let url = base64.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(url, 'base64');

    let img = await Jimp.read(buffer);
    if (side === 'width') {
        img.resize(size, Jimp.AUTO, method);
    } else {
        img.resize(Jimp.AUTO, size, method);
    }
    return await img.getBase64Async(Jimp.AUTO);
}
