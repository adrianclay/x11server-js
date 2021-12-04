export function _processPacket(processRequest: (dataView: DataView, ws: WebSocket) => void) {
  return function processPacket(dataView: DataView, ws: WebSocket) {
    const requestLengthInBytes = dataView.getInt16(2, true) * 4;
    processRequest(dataView, ws);
    if (requestLengthInBytes < dataView.byteLength) {
      processPacket(new DataView(dataView.buffer.slice(requestLengthInBytes)), ws);
    }
  }
}

type RequestHandler = (dataView : DataView, sequenceNumber: number, ws: WebSocket) => void;

export function _processRequest(
  handlers: { [opcode: number]: RequestHandler }
) {
  let sequenceNumber = 0;

  return function processRequest(dataView: DataView, ws: WebSocket) {
    const opCode = dataView.getInt8(0);
    sequenceNumber++;
    const handler = handlers[opCode];
    if(handler) {
      try {
        handler(dataView, sequenceNumber, ws);
      } catch (e) {
        // FixME: handle specific error types.
        // FixME: Only handle protocol defined errors.
        const nameError = (e.message === "Name" ? 15 : 7);
        const byteArray = new ArrayBuffer(32);
        const errorDataView = new DataView(byteArray);
        errorDataView.setUint8(0, 0);
        errorDataView.setUint8(1, nameError);
        errorDataView.setUint16(2, sequenceNumber, true);
        errorDataView.setUint8(10, opCode);

        ws.send(byteArray);
        console.log("Replaying an error to the server", e);
      }
    } else {
      console.error("Unhandled opCode: " + opCode)
    }
  }
}
