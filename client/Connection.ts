const leastSignificantByteFirstMagicValue = 0o154;

export function acceptConnection(dataView: DataView, ws: WebSocket) {
  const endianness = dataView.getInt8(0);
  if (!(endianness === leastSignificantByteFirstMagicValue)) {
    throw new Error('Unexpected byte order value ' + endianness);
  }
  const protocolMajorVersion = dataView.getInt16(1);
  const protocolMinorVersion = dataView.getInt16(3);

  const releaseNumber = 0;
  const resourceBaseId = 0;

  const resourceIdMask = 1048575;
  const motionBufferSize = 50;

  const maximumRequestLength = 4096;
  const bitmapFormatScanlineUnit = 8;
  const bitmapFormatScanlinePad = 8;
  const minKeycode = 'a'.charCodeAt(0);
  const maxKeycode = 'z'.charCodeAt(0);

  const vendor = "Barry the fish";
  const screens = [{
    root: 2,
    defaultColormap: 3,
    whitePixel: 0,
    blackPixel: 0xFFFFFF,
    currentInputMasks: 0,
    widthInPixels: 700,
    heightInPixels: 600,
    widthInMillimeters: 700,
    heightInMillimeters: 600,
    minInstalledMaps: 1,
    maxInstalledMaps: 1,
    rootVisual: 7,
    backingStores: 0,
    rootDepth: 8,
    allowedDepths: [{
      depth: 8,
      visualDepths: [{
        visualId: 7,
        class: 5,
        bitsPerRgbValue: 8,
        colormapEntries: 0,
        redMask: 0xFF0000,
        greenMask: 0x00FF00,
        blueMask: 0x0000FF,
      }],
    }]
  }];
  const formats = [{
    depth: 8,
    bitsPerPixel: 8,
    scanlinePad: 8,
  }];

  const buff = new ArrayBuffer(200);
  const writer = new DataView(buff);
  writer.setInt8(0, 1);
  writer.setUint16(2, 11, true);
  writer.setUint16(4, 0, true);

  writer.setUint32(8, releaseNumber, true);
  writer.setUint32(12, resourceBaseId, true);
  writer.setUint32(16, resourceIdMask, true);
  writer.setUint32(20, motionBufferSize, true);
  writer.setUint16(24, vendor.length, true);
  writer.setUint16(26, maximumRequestLength, true);
  writer.setUint8(28, screens.length);
  writer.setUint8(29, formats.length);
  writer.setUint8(30, 1); // ImageByteOrder
  writer.setUint8(31, 1); // BitmapFormatBitOrder
  writer.setUint8(32, bitmapFormatScanlineUnit);
  writer.setUint8(33, bitmapFormatScanlinePad);
  writer.setUint8(34, minKeycode);
  writer.setUint8(35, maxKeycode);
  // 4 padding
  for (let i = 0; i < vendor.length; i++) {
    writer.setUint8(40 + i, vendor.charCodeAt(i));
  }
  let currentOffset = 40 + vendor.length + pad(vendor.length);
  // PAD?

  formats.forEach(format => {
    writer.setUint8(currentOffset, format.depth);
    writer.setUint8(currentOffset + 1, format.bitsPerPixel);
    writer.setUint8(currentOffset + 2, format.scanlinePad);
    currentOffset += 8;
  });

  screens.forEach(screen => {
    writer.setUint32(currentOffset, screen.root, true);
    writer.setUint32(currentOffset + 4, screen.defaultColormap, true);
    writer.setUint32(currentOffset + 8, screen.whitePixel, true);
    writer.setUint32(currentOffset + 12, screen.blackPixel, true);
    writer.setUint32(currentOffset + 16, screen.currentInputMasks, true);
    writer.setUint16(currentOffset + 20, screen.widthInPixels, true);
    writer.setUint16(currentOffset + 22, screen.heightInPixels, true);
    writer.setUint16(currentOffset + 24, screen.widthInMillimeters, true);
    writer.setUint16(currentOffset + 26, screen.heightInMillimeters, true);
    writer.setUint16(currentOffset + 28, screen.minInstalledMaps, true);
    writer.setUint16(currentOffset + 30, screen.maxInstalledMaps, true);
    writer.setUint32(currentOffset + 32, screen.rootVisual, true);
    writer.setUint8(currentOffset + 36, screen.backingStores);
    writer.setUint8(currentOffset + 37, 0); //SaveUnders
    writer.setUint8(currentOffset + 38, screen.rootDepth);
    writer.setUint8(currentOffset + 39, screen.allowedDepths.length);
    currentOffset += 40;
    screen.allowedDepths.forEach(depth => {
      writer.setUint8(currentOffset, depth.depth);
      writer.setUint16(currentOffset + 2, depth.visualDepths.length, true);
      currentOffset += 8;
      depth.visualDepths.forEach(visualDepth => {
        writer.setUint32(currentOffset, visualDepth.visualId, true);
        writer.setUint8(currentOffset + 4, visualDepth.class);
        writer.setUint8(currentOffset + 5, visualDepth.bitsPerRgbValue);
        writer.setUint16(currentOffset + 6, visualDepth.colormapEntries, true);
        writer.setUint32(currentOffset + 8, visualDepth.redMask, true);
        writer.setUint32(currentOffset + 12, visualDepth.greenMask, true);
        writer.setUint32(currentOffset + 16, visualDepth.blueMask, true);
        currentOffset += 24;
      });
    });
  });

  const additionalDataLength = (currentOffset - 8) / 4;
  writer.setUint16(6, additionalDataLength, true);

  ws.send(buff.slice(0, currentOffset));
}

const pad = (E: number) => (4 - (E % 4)) % 4;
