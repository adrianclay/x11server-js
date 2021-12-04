import {extractComponentNamesFromWindowAttributeBitMask, WindowCollection} from "./Window";

export function _CreateWindow(windows: WindowCollection) {
  return function CreateWindow(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const windowId = dataView.getUint32(4, true);
    const parentWindowId = dataView.getUint32(8, true);
    const x = dataView.getInt16(12, true);
    const y = dataView.getInt16(14, true);
    const width = dataView.getUint16(16, true);
    const height = dataView.getUint16(18, true);
    const borderWidth = dataView.getUint16(20, true);
    const windowClass = dataView.getUint16(22, true);
    const visualId = dataView.getUint32(24, true);
    const attributeBitMask = dataView.getUint32(28, true);

    const windowAttributes = {};
    extractComponentNamesFromWindowAttributeBitMask(attributeBitMask).forEach((component, i) => {
      windowAttributes[component] = dataView.getUint32(32 + i * 4, true);
    });

    windows[windowId] = {parentWindowId, x, y, width, height, visualId, borderWidth, windowAttributes};
  }
}
