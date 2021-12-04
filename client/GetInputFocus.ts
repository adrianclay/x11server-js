export default function _GetInputFocus() {
  return function GetInputFocus(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const byteArray = new ArrayBuffer(100);
    const sendDataView = new DataView(byteArray);
    sendDataView.setUint8(0, 1);
    sendDataView.setUint8(1, 0);
    sendDataView.setUint16(2, sequenceNumber, true);
    sendDataView.setUint32(4, 0, true);
    sendDataView.setUint16(8, 0, true); //None
    ws.send(byteArray.slice(0, 32));
  }
}
