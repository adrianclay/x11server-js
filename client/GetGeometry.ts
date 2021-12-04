import {WindowCollection} from "./Window";

export default function _GetGeometry(windows: WindowCollection) {
  return function GetGeometry(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const drawableId = dataView.getUint32(4, true);
    const window = windows[drawableId]; // TODO: Drawable could be a mixmap

    const byteArray = new ArrayBuffer(100);
    const sendDataView = new DataView(byteArray);

    sendDataView.setUint8(0, 1);
    sendDataView.setUint8(1, 0);
    sendDataView.setUint16(2, sequenceNumber, true);
    sendDataView.setUint32(4, 0, true);
    sendDataView.setUint32(8, window.parentWindowId, true);
    sendDataView.setInt16(12, window.x, true);
    sendDataView.setInt16(14, window.y, true);
    sendDataView.setUint16(16, window.width, true);
    sendDataView.setUint16(18, window.height, true);
    sendDataView.setUint16(18, window.borderWidth, true);
    ws.send(byteArray.slice(0, 32));
  }
}
