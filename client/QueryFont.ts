export default function _QueryFont(fonts: string[]) {
  return function QueryFont(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const fontId = dataView.getUint32(4, true);
    if (!(fontId in fonts)) {
      throw new Error('Font')
    }
    const fontInfo = {
      drawDirection: 0,
      minChar: 0,
      maxChar: 0,
      allCharsExist: 0,
      defaultChar: '?',
      minBounds: {
        leftSideBearing: 1,
        rightSideBearing: 0,
        characterWidth: 10,
        ascent: 6,
        descent: 6,
      },
      maxBounds: {
        leftSideBearing: 1,
        rightSideBearing: 0,
        characterWidth: 10,
        ascent: 6,
        descent: 6,
      },
      fontAscent: 6,
      fontDescent: 6,
      properties: []
    };
    const charinfos = [];


    const byteArray = new ArrayBuffer(100);
    const sendDataView = new DataView(byteArray);
    sendDataView.setUint8(0, 1);
    sendDataView.setUint16(2, sequenceNumber, true);
    sendDataView.setUint32(4, 7 + 2 * fontInfo.properties.length + 3 * charinfos.length, true);
    putCharInfo(sendDataView, 8, fontInfo.minBounds);
    putCharInfo(sendDataView, 24, fontInfo.maxBounds);
    sendDataView.setUint16(40, fontInfo.minChar, true);
    sendDataView.setUint16(42, fontInfo.maxChar, true);
    sendDataView.setUint16(44, fontInfo.defaultChar.charCodeAt(0), true);
    sendDataView.setUint16(46, fontInfo.properties.length, true);
    sendDataView.setUint8(48, fontInfo.drawDirection);
    sendDataView.setUint8(49, fontInfo.minChar);
    sendDataView.setUint8(50, fontInfo.maxChar);
    sendDataView.setUint8(51, fontInfo.allCharsExist);
    sendDataView.setInt16(52, fontInfo.fontAscent, true);
    sendDataView.setInt16(54, fontInfo.fontDescent, true);
    sendDataView.setUint32(56, charinfos.length, true);
    fontInfo.properties.forEach((prop, index) => {
      sendDataView.setUint32(60 + index * 8, prop.atom, true);
      sendDataView.setUint32(60 + index * 8 + 4, prop.value, true);
    });
    charinfos.forEach((charInfo, index) => {
      throw new Error('Not Implemented');
    });

    ws.send(byteArray.slice(0, 60 + fontInfo.properties.length * 8));
  }

}
function putCharInfo(dataView: DataView, byteOffset: number, charInfo: any) {
  dataView.setInt16(byteOffset, charInfo.leftSideBearing, true);
  dataView.setInt16(byteOffset + 2, charInfo.rightSideBearing, true);
  dataView.setInt16(byteOffset + 4, charInfo.characterWidth, true);
  dataView.setInt16(byteOffset + 6, charInfo.ascent, true);
  dataView.setInt16(byteOffset + 8, charInfo.descent, true);
  dataView.setUint16(byteOffset + 10, charInfo.attributes, true);
}
