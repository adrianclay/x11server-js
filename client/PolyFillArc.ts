export default function _PolyFillArc(context : CanvasRenderingContext2D) {
  return function PolyFillArc(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const numberOfArcs = (dataView.getUint16(2, true) - 3) / 3;
    const drawable = dataView.getUint32(4, true);
    const graphicsContext = dataView.getUint32(8, true);
    const arcs = new Array();
    for (let i = 0; i < numberOfArcs; i++) {
      arcs[i] = {
        x: dataView.getInt16(12 + i * 12 + 0, true),
        y: dataView.getInt16(12 + i * 12 + 2, true),
        width: dataView.getUint16(12 + i * 12 + 4, true),
        height: dataView.getUint16(12 + i * 12 + 6, true),
        angle1: dataView.getInt16(12 + i * 12 + 8, true) / 64,
        angle2: dataView.getInt16(12 + i * 12 + 10, true) / 64,
      };
    }

    arcs.forEach(arc => {
      context.beginPath();
      context.fillStyle = 'black';
      context.ellipse(arc.x + (arc.width / 2), arc.y + (arc.height / 2), arc.width, arc.height, 0, arc.angle1 * Math.PI / 180, arc.angle2 * Math.PI / 180)
      context.fill();
    });

    console.log(arcs);
  }
}
