export default function _PolyFillRectangle(context: CanvasRenderingContext2D) {
  return function PolyFillRectangle(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const numberOfRectangles = (dataView.getUint16(2, true) - 3) / 2;
    const drawable = dataView.getUint32(4, true);
    const graphicsContext = dataView.getUint32(8, true);
    const rectangles = new Array(numberOfRectangles);
    for (let i = 0; i < numberOfRectangles; i++) {
      rectangles[i] = {
        x: dataView.getInt16(12 + i * 8 + 0, true),
        y: dataView.getInt16(12 + i * 8 + 2, true),
        width: dataView.getUint16(12 + i * 8 + 4, true),
        height: dataView.getUint16(12 + i * 8 + 6, true),
      };
    }

    context.beginPath();
    context.fillStyle = 'white';
    rectangles.forEach(
      rect => context.rect(rect.x, rect.y, rect.width, rect.height)
    );
    context.fill();
  }
}
