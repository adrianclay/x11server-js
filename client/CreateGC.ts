import {extractComponentNamesFromGraphicsContextBitMask, GCEnum, GraphicsContextCollection} from "./GraphicsContext";

export function _CreateGC(graphicsContext: GraphicsContextCollection) {
  return function CreateGC(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const numberOfValues = dataView.getUint16(2, true) - 4;
    const graphicsContextId = dataView.getUint32(4, true);
    const drawableId = dataView.getUint32(8, true);
    const bitmask = dataView.getUint32(12, true) as GCEnum;

    const values = {};
    extractComponentNamesFromGraphicsContextBitMask(bitmask).forEach((component, i) => {
      values[component] = dataView.getUint32(16 + i * 4, true);
    });

    graphicsContext[graphicsContextId] = {
      drawableId,
      values,
    };
  };
}
