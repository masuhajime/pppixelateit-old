import { Buffer } from "buffer"
import Jimp from "jimp"
import { RGBA, Vector2 } from "../dto/generals"


const rgbaDiff = (rgba1: RGBA, rgba2: RGBA) => {
    // if (rgba1.a === 255 && rgba2.a === 255) {
    //     return 0;
    // }
    return Math.abs(rgba1.r - rgba2.r) + Math.abs(rgba1.g - rgba2.g) + Math.abs(rgba1.b - rgba2.b) + Math.abs(rgba1.a - rgba2.a);
}

export const fillWithColorFromPoint = async (imageBuffer: Buffer, vec: Vector2, rgbaFill: RGBA, tolerance: number) => {
    let img = await Jimp.read(imageBuffer);
    // get pixel color of 0,0
    let colorTarget = img.getPixelColor(vec.x, vec.y);
    console.log('colorTarget', colorTarget, Jimp.intToRGBA(colorTarget));

    return fillWithColorA(
        imageBuffer,
        Jimp.intToRGBA(colorTarget),
        rgbaFill,
        tolerance
    );
}

export const fillWithColorA = async (imageBuffer: Buffer, rgbaTarget: RGBA, rgbaFill: RGBA, tolerance: number) => {
    let img = await Jimp.read(imageBuffer);
    let colorTarget = img.getPixelColor(0, 0);
    console.log('colorTarget', colorTarget, Jimp.intToRGBA(colorTarget), rgbaTarget, rgbaFill);


    const fillImageRecursive = (x: number, y: number, rgbaTarget: RGBA, tolerance: number, maxDepth: number): number => {
        if (maxDepth === 0) {
            return 0;
        }
        let totalFilled = 0;
        const pixelColor = img.getPixelColor(x, y);
        const pixelRgba = Jimp.intToRGBA(pixelColor);
        const diff = rgbaDiff(pixelRgba, rgbaTarget);

        if (diff < tolerance) {
            if (diff !== 0) {
                img.setPixelColor(Jimp.rgbaToInt(rgbaTarget.r, rgbaTarget.g, rgbaTarget.b, rgbaTarget.a), x, y);
                totalFilled++;
            }
            // check if x,y is in bounds
            if (x < img.bitmap.width - 1) {
                totalFilled += fillImageRecursive(x + 1, y, rgbaTarget, tolerance, maxDepth - 1);
            }
            if (x > 0) {
                totalFilled += fillImageRecursive(x - 1, y, rgbaTarget, tolerance, maxDepth - 1);
            }
            if (y < img.bitmap.height - 1) {
                totalFilled += fillImageRecursive(x, y + 1, rgbaTarget, tolerance, maxDepth - 1);
            }
            if (y > 0) {
                totalFilled += fillImageRecursive(x, y - 1, rgbaTarget, tolerance, maxDepth - 1);
            }
        }
        return totalFilled;
    }

    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        const pixelColor = img.getPixelColor(x, y);
        const pixelRgba = Jimp.intToRGBA(pixelColor);
        fillImageRecursive(x, y, pixelRgba, tolerance, 3)
    });
    // img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    //     const xt = img.bitmap.width - x - 1;
    //     const yt = img.bitmap.height - y - 1;
    //     const pixelColor = img.getPixelColor(xt, yt);
    //     const pixelRgba = Jimp.intToRGBA(pixelColor);
    //     fillImageRecursive(xt, yt, pixelRgba, tolerance, 3)
    // });

    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        const pixelColor = img.getPixelColor(x, y);
        const pixelRgba = Jimp.intToRGBA(pixelColor);
        const fillRgba = Jimp.rgbaToInt(rgbaFill.r, rgbaFill.g, rgbaFill.b, rgbaFill.a);

        if (rgbaDiff(pixelRgba, rgbaTarget) === 0) {// another tolerance
            img.setPixelColor(fillRgba, x, y);
        }
    });
    return img.getBufferAsync(Jimp.MIME_PNG);
}