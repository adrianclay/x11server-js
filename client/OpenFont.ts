// const { TextDecoder } = require('util');

export default function _OpenFont(fonts : string[]) {
  return function OpenFont(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const fontId = dataView.getUint32(4, true);
    const fontNameLength = dataView.getUint16(8, true);
    const textDecoder = new TextDecoder();
    const fontName = textDecoder.decode(dataView.buffer.slice(12, 12 + fontNameLength));

    if(fontName === 'nil2') {
      throw new Error('Name');
    }

    fonts[fontId] = fontName;
  }
}
