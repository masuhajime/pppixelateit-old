import { Buffer } from "buffer"
import Jimp from "jimp"

export const greyscale = async (base64: string) => {

    let url = base64.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(url, 'base64');

    let img = await Jimp.read(buffer);
    img.greyscale();
    return await img.getBase64Async(Jimp.AUTO);
}
