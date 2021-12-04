import {GraphicsContextCollection} from "./GraphicsContext";
import { WindowCollection } from "./Window";

export default function _PolyText8(context : CanvasRenderingContext2D, graphicsContexts: GraphicsContextCollection, windows: WindowCollection) {
  return function PolyText8(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const payloadSize = (dataView.getUint16(2, true) - 4) * 4;
    const drawableId = dataView.getUint32(4, true);
    const window = windows[drawableId];
    const graphicsContextId = dataView.getUint32(8, true);
    const x = dataView.getInt16(12, true);
    const y = dataView.getInt16(14, true);
    const textDecoder = new TextDecoder();

    const lengthOfString = dataView.getUint8(16);
    const delta = dataView.getUint8(17);
    const text = textDecoder.decode(dataView.buffer.slice(18, 18 + lengthOfString));

    const graphicsContext = graphicsContexts[graphicsContextId];

    // const foreground = '#' + Number(graphicsContext.values.Foreground).toString(16).padStart(6, '0');
    const foreground = '#' + '000000';
    context.fillStyle = foreground;
    context.font = '12px serif';
    context.fillText(text, x + window.x, y + window.y);
  };
}
