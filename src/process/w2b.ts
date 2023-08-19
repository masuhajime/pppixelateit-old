// import cv from "@u4/opencv4nodejs";
import cv from "@techstark/opencv-js"
import { Buffer } from "buffer"
import Jimp from "jimp"

export const greyscale = async (base64: string) => {

    let url = base64.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(url, 'base64');

    let img = await Jimp.read(buffer);
    img.greyscale();
    return await img.getBase64Async(Jimp.MIME_PNG);
}

type ResizeMethod =
    | "nearestNeighbor"
    | "bilinearInterpolation"
    | "bicubicInterpolation"
    | "hermiteInterpolation"
    | "bezierInterpolation";
export const resizeBaseOn = async (base64: string, side: string | 'width' | 'height', size: number, method: string | ResizeMethod) => {

    console.log('resizeBaseOn', side, size, method);

    let url = base64.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(url, 'base64');

    let img = await Jimp.read(buffer);
    if (side === 'width') {
        img.resize(size, Jimp.AUTO, method);
    } else {
        img.resize(Jimp.AUTO, size, method);
    }
    return await img.getBase64Async(Jimp.MIME_PNG);
}

export const posterize = async (base64: string, number: number) => {

    let url = base64.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(url, 'base64');

    let img = await Jimp.read(buffer);
    img.posterize(number);
    return await img.getBase64Async(Jimp.MIME_PNG);
}

export const pixelate = async (base64: string, number: number) => {

    let url = base64.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(url, 'base64');

    let img = await Jimp.read(buffer);
    img.pixelate(number);
    return await img.getBase64Async(Jimp.MIME_PNG);
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

export const fill00ColorToTransparent = async (base64: string) => {

    let url = base64.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(url, 'base64');

    let img = await Jimp.read(buffer);
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
    return await img.getBase64Async(Jimp.MIME_PNG);
}

export const outlinePaint = async (base64: string) => {

    let url = base64.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(url, 'base64');

    let img = await Jimp.read(buffer);

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
    return await img.getBase64Async(Jimp.MIME_PNG);
}


export const opencv2 = async (base64: string) => {
    let url = base64.replace(/^data:image\/\w+;base64,/, "");
    console.log('base64', base64);
    console.log('url', url);

    let buffer = Buffer.from(url, 'base64');
    let img = await Jimp.read(buffer);
    const src = cv.matFromImageData({
        data: img.bitmap.data,
        width: img.bitmap.width,
        height: img.bitmap.height
    });
    const dst = new cv.Mat();

    let n4 = new cv.Mat(3, 3, cv.CV_8U);
    let n4Data = new Uint8Array([
        0, 1, 0,
        1, 1, 1,
        0, 1, 0
    ]);
    n4.data.set(n4Data);

    // const M = cv.Mat.ones(2, 2, cv.CV_8U);
    const anchor = new cv.Point(0, 0);
    cv.erode(src, dst, n4, anchor, 1);

    const bufferDst = Buffer.from(dst.data);

    const jimpImageS = new Jimp({
        data: bufferDst,
        width: dst.cols,
        height: dst.rows
    });
    return await jimpImageS.getBase64Async(Jimp.MIME_PNG);
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
