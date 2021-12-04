export default function _InternAtom(atoms : string[]) {
  return function InternAtom(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const onlyIfExists = dataView.getUint8(1);
    const atomNameLength = dataView.getUint16(4, true);
    const textDecoder = new TextDecoder();
    const atomName = textDecoder.decode(dataView.buffer.slice(8, 8 + atomNameLength));

    let atomId = atoms.indexOf(atomName) + 1;
    if(!onlyIfExists && !atomId) {
      atomId = atoms.push(atomName);
    }

    const byteArray = new ArrayBuffer(100);
    const sendDataView = new DataView(byteArray);
    sendDataView.setUint8(0, 1);
    sendDataView.setUint16(2, sequenceNumber, true);
    sendDataView.setUint32(8, atomId, true);
    ws.send(byteArray.slice(0, 32));
  }
}
