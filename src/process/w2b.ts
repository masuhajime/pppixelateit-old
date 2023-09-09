// import cv from "@u4/opencv4nodejs";
import cv from "@techstark/opencv-js"
import { Buffer } from "buffer"
import Jimp from "jimp"
import useNodeStore from "../store/store"
import { RGBA, Vector2 } from "../dto/generals"

export const doNodeProcess = async (nodeId: string, callback: () => void) => {
    const store = useNodeStore.getState();
    store.nodeSetProcessing(nodeId, true);
    await callback();
    store.nodeSetProcessing(nodeId, false);
}


export const greyscale = async (imageBuffer: Buffer) => {

    let img = await Jimp.read(imageBuffer);
    img.greyscale();
    return img.getBufferAsync(Jimp.MIME_PNG);
}

type ResizeMethod =
    | "nearestNeighbor"
    | "bilinearInterpolation"
    | "bicubicInterpolation"
    | "hermiteInterpolation"
    | "bezierInterpolation";
export const resizeBaseOn = async (imageBuffer: Buffer, side: string | 'width' | 'height', size: number, method: string | ResizeMethod) => {

    let img = await Jimp.read(imageBuffer);
    if (side === 'width') {
        img.resize(size, Jimp.AUTO, method);
    } else {
        img.resize(Jimp.AUTO, size, method);
    }
    return img.getBufferAsync(Jimp.MIME_PNG);
}

export const posterize = async (imageBuffer: Buffer, number: number) => {

    let img = await Jimp.read(imageBuffer);
    img.posterize(number);
    return img.getBufferAsync(Jimp.MIME_PNG);
}

export const pixelate = async (imageBuffer: Buffer, number: number) => {

    let img = await Jimp.read(imageBuffer);
    img.pixelate(number);
    return img.getBufferAsync(Jimp.MIME_PNG);
}

export const drawOutline = async (base64: string, number: number) => {

    let url = base64.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(url, 'base64');

    let img = await Jimp.read(buffer);
    // paint image outline to white
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        if (x === 0 || y === 10 || x === img.bitmap.width - 1 || y === img.bitmap.height - 1) {
            this.bitmap.data[idx] = 255;
            this.bitmap.data[idx + 1] = 255;
            this.bitmap.data[idx + 2] = 255;
            this.bitmap.data[idx + 3] = 255;
        }
    });
    return await img.getBase64Async(Jimp.MIME_PNG);
}

export const getBufferFromBase64 = (imageBase64: string) => {
    let strImage = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    return Buffer.from(strImage, 'base64');
}

export const getBuffer = (base64: string) => {
    return Buffer.from(base64, 'base64');
}


export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}

export const fill00ColorToTransparent = async (imageBuffer: Buffer) => {
    let img = await Jimp.read(imageBuffer);
    // get pixel color of 0,0
    let colorTarget = img.getPixelColor(0, 0);
    console.log('colorTarget', colorTarget, Jimp.intToRGBA(colorTarget));

    // paint colorTarget to transparent
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        if (img.getPixelColor(x, y) === colorTarget) {
            this.bitmap.data[idx + 0] = 0;
            this.bitmap.data[idx + 1] = 0;
            this.bitmap.data[idx + 2] = 0;
            this.bitmap.data[idx + 3] = 0;
        }
    });
    return img.getBufferAsync(Jimp.MIME_PNG);
}

const rgbaDiff = (rgba1: RGBA, rgba2: RGBA) => {
    return Math.abs(rgba1.r - rgba2.r) + Math.abs(rgba1.g - rgba2.g) + Math.abs(rgba1.b - rgba2.b) + Math.abs(rgba1.a - rgba2.a);
}

export const fillWithColor = async (imageBuffer: Buffer, vec: Vector2, rgba: RGBA, tolerance: number) => {
    let img = await Jimp.read(imageBuffer);
    // get pixel color of 0,0
    let colorTarget = img.getPixelColor(vec.x, vec.y);
    let colorTargetRgba = Jimp.intToRGBA(colorTarget);
    console.log('colorTarget', colorTarget, Jimp.intToRGBA(colorTarget));

    // paint colorTarget to transparent
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        const pixelColor = img.getPixelColor(x, y);
        const pixelRgba = Jimp.intToRGBA(pixelColor);

        if (rgbaDiff(pixelRgba, colorTargetRgba) < tolerance) {
            this.bitmap.data[idx + 0] = rgba.r;
            this.bitmap.data[idx + 1] = rgba.g;
            this.bitmap.data[idx + 2] = rgba.b;
            this.bitmap.data[idx + 3] = rgba.a;
        }
    });
    return img.getBufferAsync(Jimp.MIME_PNG);
}

export const outlinePaint = async (imageBuffer: Buffer) => {
    let img = await Jimp.read(imageBuffer);

    const baseColor = img.getPixelColor(0, 0);

    const cloneImage = img.clone();

    // paint colorTarget to transparent
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        // get pixel color around 8 direction by array
        let colorAround = getPixelColorAround(cloneImage, x, y);
        // get current pixel color
        let colorCurrent = cloneImage.getPixelColor(x, y);
        // if current color is base color and around pixel color include non base color
        // colorCurrent === baseColor && 
        const countDifferentColorAround = colorAround.filter(color => color !== baseColor).length;
        // if (colorCurrent === baseColor && countDifferentColorAround > 1) {
        //     this.bitmap.data[idx + 0] = 255;
        //     this.bitmap.data[idx + 1] = 0;
        //     this.bitmap.data[idx + 2] = 0;
        //     this.bitmap.data[idx + 3] = 255;
        // }

        // 鋭角のpixelを省くことができる
        // if (colorCurrent !== baseColor && countDifferentColorAround < 4) {
        //     this.bitmap.data[idx + 0] = 255;
        //     this.bitmap.data[idx + 1] = 0;
        //     this.bitmap.data[idx + 2] = 0;
        //     this.bitmap.data[idx + 3] = 255;
        // }

        // draw outline in inner side
        if (colorCurrent !== baseColor && countDifferentColorAround < 7) {
            this.bitmap.data[idx + 0] = 0;
            this.bitmap.data[idx + 1] = 0;
            this.bitmap.data[idx + 2] = 0;
            this.bitmap.data[idx + 3] = 255;
        }
    });
    return img.getBufferAsync(Jimp.MIME_PNG);
}


export const opencv2 = async (imageBuffer: Buffer) => {
    let img = await Jimp.read(imageBuffer);
    const src = cv.matFromImageData({
        data: img.bitmap.data,
        width: img.bitmap.width,
        height: img.bitmap.height
    });
    // const dst = new cv.Mat();

    // let n4 = new cv.Mat(3, 3, cv.CV_8U);
    // let n4Data = new Uint8Array([
    //     0, 1, 0,
    //     1, 1, 1,
    //     0, 1, 0
    // ]);
    // n4.data.set(n4Data);

    // // const M = cv.Mat.ones(2, 2, cv.CV_8U);
    // const anchor = new cv.Point(0, 0);
    // cv.erode(src, dst, n4, anchor, 1);


    let n4 = new cv.Mat(3, 3, cv.CV_8U);
    let n4Data = new Uint8Array([
        0, 1, 0,
        1, 1, 1,
        0, 1, 0,
    ]);
    n4.data.set(n4Data);

    let eroded = new cv.Mat();
    const anchor = new cv.Point(-1, -1);
    // cv.erode(src, eroded, n4, anchor);
    cv.Scalar.all(0);
    cv.erode(src, eroded, n4, anchor, 1, cv.BORDER_DEFAULT, new cv.Scalar(1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0));

    // log height and width
    // console.log('src', src.rows, src.cols, "eroded", eroded.rows, eroded.cols);

    // let bitwise_not = new cv.Mat();
    // //cv.bitwise_not(src, bitwise_not);  // エロージョン画像のビットを反転
    // // cv.bitwise_and(src, eroded, bitwise_not);
    // // let highlightedEdges = new cv.Mat();
    // cv.subtract(src, eroded, bitwise_not);  // エッジを強調


    const bufferDst = Buffer.from(eroded.data);

    const jimpImageS = new Jimp({
        data: bufferDst,
        width: eroded.cols,
        height: eroded.rows
    });
    return await jimpImageS.getBufferAsync(Jimp.MIME_PNG);
}

const getPixelColor = (img: Jimp, x: number, y: number) => {
    return img.getPixelColor(x, y);
}

const getPixelColorAround = (img: Jimp, x: number, y: number) => {
    return [
        img.getPixelColor(x - 1, y - 1),
        img.getPixelColor(x, y - 1),
        img.getPixelColor(x + 1, y - 1),
        img.getPixelColor(x - 1, y),
        img.getPixelColor(x + 1, y),
        img.getPixelColor(x - 1, y + 1),
        img.getPixelColor(x, y + 1),
        img.getPixelColor(x + 1, y + 1),
    ];
}
