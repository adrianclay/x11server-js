import {WindowCollection} from "./Window";

export default function _GetWindowAttributes(windows: WindowCollection) {
  return function GetWindowAttributes(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const windowId = dataView.getUint32(4, true);
    const window = windows[windowId];


    const byteArray = new ArrayBuffer(100);
    const sendDataView = new DataView(byteArray);
    sendDataView.setUint8(0, 1);
    sendDataView.setUint8(1, 0); // NotUseful
    sendDataView.setUint16(2, sequenceNumber, true);
    sendDataView.setUint32(4, 3, true);
    sendDataView.setUint32(8, window.visualId, true);
    sendDataView.setUint16(12, 1, true); //InputOutput
    sendDataView.setUint8(14, 0); //BitGravity: Forget
    sendDataView.setUint8(15, 1); //WinGravity: NorthWest
    sendDataView.setUint32(16, 0, true); //backing-planes
    sendDataView.setUint32(20, 0, true); //backing-pixel
    sendDataView.setUint8(24, 1); //SaveUnder
    sendDataView.setUint8(25, 1); //MapIsInstalled
    sendDataView.setUint8(26, 1); //MapState
    sendDataView.setUint8(27, 0); //OverrideRedirect
    sendDataView.setUint32(28, 0, true); //ColorMap
    sendDataView.setUint32(32, 0, true); //AllEventsMask
    sendDataView.setUint32(36, 0, true); //YourEventsMask
    sendDataView.setUint16(40, 0, true); //DoNotPropogateMask
    ws.send(byteArray.slice(0, 44));
  }
}
