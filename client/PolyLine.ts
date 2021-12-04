import {WindowCollection} from "./Window";

export function _PolyLine(windows : WindowCollection, context : CanvasRenderingContext2D) {
  enum CoordinateMode {
    Origin = 0,
    Previous = 1,
  }

  return function PolyLine(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const coordMode = dataView.getUint8(1) as CoordinateMode;
    const numberOfPoints = dataView.getUint16(2, true) - 3;
    const drawableId = dataView.getUint32(4, true);
    const graphicsContext = dataView.getUint32(8, true);

    const points : {x: number, y : number}[] = [];
    for (let i = 0; i < numberOfPoints; i++) {
      const x = dataView.getInt16(12 + i * 4, true);
      const y = dataView.getInt16(12 + i * 4 + 2, true);
      if (coordMode === CoordinateMode.Origin || points.length === 0) {
        points.push({ x, y });
      } else {
        points.push({ x: x + points[points.length - 1].x, y: y + points[points.length - 1].y});
      }

    }

    context.beginPath();
    context.strokeStyle = 'black';
    points.forEach(
      ({ x, y }) => context.lineTo(x, y)
    );
    context.stroke();

  }
}
