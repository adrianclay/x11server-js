export default function _GetModifierMapping() {
  return function GetModifierMapping(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const byteArray = new ArrayBuffer(100);
    const sendDataView = new DataView(byteArray);
    const keyCodesPerModifier = 1;
    sendDataView.setUint8(0, 1);
    sendDataView.setUint8(1, keyCodesPerModifier);
    sendDataView.setUint16(2, sequenceNumber, true);
    sendDataView.setUint32(4, 2 * keyCodesPerModifier, true);

    sendDataView.setUint8(32, 0x40);
    sendDataView.setUint8(33, 0x41);
    sendDataView.setUint8(34, 0x43);
    sendDataView.setUint8(35, 0x42);
    sendDataView.setUint8(36, 0x3f);

    ws.send(byteArray.slice(0, 32 + 8 * keyCodesPerModifier));
  }
}
