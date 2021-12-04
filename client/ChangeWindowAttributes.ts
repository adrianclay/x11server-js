import { ExposeWindow } from "./ExposeWindow";
import { extractComponentNamesFromWindowAttributeBitMask, WindowAttributeEnum, WindowCollection } from "./Window";

export default function _ChangeWindowAttributes(windows: WindowCollection) {
  return function ChangeWindowAttributes(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const windowId = dataView.getUint32(4, true);
    const bitmask = dataView.getUint32(8, true) as WindowAttributeEnum;

    const windowAttributes = {};
    extractComponentNamesFromWindowAttributeBitMask(bitmask).forEach((component, i) => {
      windowAttributes[component] = dataView.getUint32(12 + i * 4, true);
    });

    const window = windows[windowId];
    window.windowAttributes = windowAttributes;
    ExposeWindow(windowId, window, ws, sequenceNumber);
  };
}
