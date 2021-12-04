import MessageBuilder from "./MessageBuilder";

export default function _QueryPointer(canvas: HTMLCanvasElement) {
  return function QueryPointer(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const x = canvas.x;
    const y = canvas.y;
    const windowId = dataView.getUint32(4, true);


    const messageBuilder = MessageBuilder.Reply(sequenceNumber, 0,1);
    messageBuilder.window(2); // Root
    messageBuilder.window(windowId); // Child
    messageBuilder.int16(x);
    messageBuilder.int16(y);
    messageBuilder.int16(x);
    messageBuilder.int16(y);
    messageBuilder.card16(0); // KeyButMask
    ws.send(messageBuilder.build());
  }
}
