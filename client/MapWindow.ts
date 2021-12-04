import MessageBuilder from "./MessageBuilder";
import { WindowAttributeEnum, WindowCollection } from "./Window";
import {EventMask} from "./Event"
import { ExposeWindow } from "./ExposeWindow";

export default function _MapWindow(windows: WindowCollection) {
  return function MapWindow(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const windowId = dataView.getUint32(4, true);
    const window = windows[windowId];

    const event = MessageBuilder.Event(sequenceNumber, 19);
    event.card32(window.parentWindowId);
    event.card32(windowId);
    event.bool(false); // OverrideRedirect
    ws.send(event.build());

    ExposeWindow(windowId, window, ws, sequenceNumber);
  };
}
