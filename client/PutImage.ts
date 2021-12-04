import {WindowCollection} from "./Window";
import {PixmapCollection} from "./Pixmap";

export default function _PutImage(windows : WindowCollection, pixmaps : PixmapCollection) {
  return function PutImage(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const drawableId = dataView.getUint32(4, true);
    const graphicsContext = dataView.getUint32(8, true);
    const width = dataView.getUint16(12, true);
    const height = dataView.getUint16(14, true);
    const x = dataView.getInt16(16, true);
    const y = dataView.getInt16(18, true);
    const leftPad = dataView.getUint8(20);
    const depth = dataView.getUint8(21);

    const pixmap = pixmaps[drawableId];

    console.assert(depth === 1);
    console.assert(leftPad === 0);

    const imageData = pixmap.context.getImageData(x, y, width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelLinearPosition = y * width + x;
        let uint8 = dataView.getUint8(24 + Math.floor(pixelLinearPosition / 8));

        const isFilled = uint8 & (1 << (pixelLinearPosition % 8));
        const color = isFilled ? 0 : 255;
        imageData.data[pixelLinearPosition * 4] = color;
        imageData.data[pixelLinearPosition * 4 + 1] = color;
        imageData.data[pixelLinearPosition * 4 + 2] = color;
        imageData.data[pixelLinearPosition * 4 + 3] = 255;
      }
    }
    pixmap.context.putImageData(imageData, x, y);
  };
}
