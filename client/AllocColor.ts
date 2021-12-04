export default function _AllocColor() {
  return function AllocColor(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const colorMapId = dataView.getUint32(4, true);
    const red = dataView.getUint16(8, true) && 0xFF00;
    const green = dataView.getUint16(10, true) && 0xFF00;
    const blue = dataView.getUint16(12, true) && 0xFF00;

    const byteArray = new ArrayBuffer(100);
    const sendDataView = new DataView(byteArray);
    sendDataView.setUint8(0, 1);
    sendDataView.setUint8(1, 0);
    sendDataView.setUint16(2, sequenceNumber, true);
    sendDataView.setUint32(4, 0, true);
    sendDataView.setUint16(8, red, true);
    sendDataView.setUint16(10, green, true);
    sendDataView.setUint16(12, blue, true);
    sendDataView.setUint32(16, (red << 8) + green + (blue >> 8), true);
    ws.send(byteArray.slice(0, 32));
  };
}
