export default function _QueryColors() {
  return function QueryColors(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const colorMap = dataView.getUint32(4, true);
    const numberOfPixel = dataView.getUint16(2, true) - 2;
    const pixels = new Array<number>(numberOfPixel);
    for (let i = 0; i < numberOfPixel; i++) {
      pixels[i] = dataView.getUint32(8 + 4 * i, true);
    }
    console.log(colorMap, pixels);

    const byteArray = new ArrayBuffer(100);
    const sendDataView = new DataView(byteArray);
    sendDataView.setUint8(0, 1);
    sendDataView.setUint16(2, sequenceNumber, true);
    sendDataView.setUint32(4, numberOfPixel * 2, true);
    sendDataView.setUint16(8, numberOfPixel, true);
    for (let i = 0; i < numberOfPixel; i++) {
      sendDataView.setUint16(32 + (i * 8), 65535, true);
      sendDataView.setUint16(32 + (i * 8) + 2, 65535, true);
      sendDataView.setUint16(32 + (i * 8) + 4, 65535, true);
    }
    ws.send(byteArray.slice(0, 32 + 8 * numberOfPixel));
  }
}
