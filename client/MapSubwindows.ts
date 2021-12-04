import MessageBuilder from "./MessageBuilder";
import { WindowCollection } from "./Window";
import { ExposeWindow } from "./ExposeWindow";

export default function _MapSubwindows(windows: WindowCollection) {
  return function MapSubwindows(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const parentWindowId = dataView.getUint32(4, true);
    const subWindows = Object.entries(windows).filter(([_, window]) => window.parentWindowId == parentWindowId);
    subWindows.forEach(([windowIdStr, window]) => {
      const windowId = Number.parseInt(windowIdStr);

      const event = MessageBuilder.Event(sequenceNumber, 19);
      event.card32(window.parentWindowId);
      event.card32(windowId);
      event.bool(false); // OverrideRedirect
      ws.send(event.build());

      ExposeWindow(windowId, window, ws, sequenceNumber);
    });
  };
}
