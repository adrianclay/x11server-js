export default function _LookupColor() {
  return function LookupColor(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const colorNameLength = dataView.getUint16(8, true);
    const textDecoder = new TextDecoder();
    const colorName = textDecoder.decode(dataView.buffer.slice(12, 12 + colorNameLength));
    const colorMap = dataView.getUint32(4, true);

    console.log('LookupColor', colorName);
    const red = 0, green = 0xffff, blue = 0;

    const byteArray = new ArrayBuffer(100);
    const sendDataView = new DataView(byteArray);
    sendDataView.setUint8(0, 1);
    sendDataView.setUint16(2, sequenceNumber, true);
    sendDataView.setUint16(8, red, true);
    sendDataView.setUint16(10, green, true);
    sendDataView.setUint16(12, blue, true);
    sendDataView.setUint16(14, red, true);
    sendDataView.setUint16(16, green, true);
    sendDataView.setUint16(18, blue, true);
    ws.send(byteArray.slice(0, 32));
  };
}
