import {PixmapCollection} from "./Pixmap";

export default function _CreatePixmap(pixmaps : PixmapCollection) {
  return function CreatePixmap(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const depth = dataView.getUint8(1);
    const pixmapId = dataView.getUint32(4, true);
    const drawableId = dataView.getUint32(8, true);
    const width = dataView.getUint16(12, true);
    const height = dataView.getUint16(14, true);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.borderColor = 'green';
    canvas.style.borderStyle = 'solid';

    document.getElementById('pixmaps').appendChild(canvas);
    const context = canvas.getContext('2d');

    pixmaps[pixmapId] = {
      canvas, context
    };

    console.log('Created a pixmap', canvas);
  }
}
