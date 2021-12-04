export default function _GetKeyboardMapping() {
  return function GetKeyboardMapping(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const firstKeyCode = dataView.getUint8(4);
    const numberOfKeys = dataView.getUint8(5);

    const keySymsPerKeyCode = 1;
    const byteArray = new ArrayBuffer(32 + 4 * numberOfKeys * keySymsPerKeyCode);
    const sendDataView = new DataView(byteArray);
    sendDataView.setUint8(0, 1);
    sendDataView.setUint8(1, keySymsPerKeyCode);
    sendDataView.setUint16(2, sequenceNumber, true);
    sendDataView.setUint32(4, numberOfKeys * keySymsPerKeyCode, true);

    for(let i = 0; i < numberOfKeys; i++) {
      sendDataView.setUint32(32 + i * 4 * keySymsPerKeyCode, firstKeyCode + i, true);
    }
    ws.send(byteArray);
  };
}
