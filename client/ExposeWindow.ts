import { EventMask } from "./Event";
import MessageBuilder from "./MessageBuilder";
import Window from "./Window";

export function ExposeWindow(windowId: number, window : Window, ws: WebSocket, sequenceNumber: number) {
  if(window.windowAttributes.EventMask & EventMask.Exposure) {
    const event = MessageBuilder.Event(sequenceNumber, 12);
    event.card32(windowId);
    event.card16(0); // x
    event.card16(0); // y
    event.card16(window.width);
    event.card16(window.height);
    event.card16(0); // count (remaining exposes)
    ws.send(event.build());
  }
}
