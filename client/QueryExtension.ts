export default function _QueryExtension() {
  return function QueryExtension(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const byteArray = new ArrayBuffer(100);
    const sendDataView = new DataView(byteArray);
    sendDataView.setUint8(0, 1);
    sendDataView.setUint16(2, sequenceNumber, true);
    sendDataView.setUint32(4, 0, true);
    sendDataView.setUint8(8, 0); // Present
    ws.send(byteArray.slice(0, 32));
  }
}
