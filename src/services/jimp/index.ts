import jimp from 'jimp';

export interface WriteOnImageProps {
  text: string;
  filename: string;
  coordinates: { x: number; y: number };
}

export class Jimp {
  static async writeOnImage({ text, filename, coordinates }: WriteOnImageProps) {
    const font = await jimp.loadFont(`${process.cwd()}/assets/fonts/Capriola.fnt`);
    const image = await jimp.read(`${process.cwd()}/assets/images/${filename}`);

    image.print(font, coordinates.x, coordinates.y, text);

    return await image.getBufferAsync(jimp.MIME_JPEG);
  }
}
