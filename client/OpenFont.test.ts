import _OpenFont from "./OpenFont";

function dataViewFromHex(hex: string) {
  const bytes = new Uint8Array(hex.match(/../g).map(s => Number.parseInt(s, 16)));
  return new DataView(bytes.buffer);
}

test('Raises error for nil2 name', () => {
  const dataView = dataViewFromHex("3700060000000000020000000c000000ffffff00000000001400060002000000170000001f0000000000000000e1f505");

  const openFont = _OpenFont([]);
  expect(openFont.bind(null, dataView, 0, null)).toThrowError('Name');
});

test('Does nothing for cursor name', () => {
  const dataView = dataViewFromHex("2d0005000100000006000000637572736f7200005ee1080002000000010000000100000098009900000000000000ffffffffffff620006000f000000584672656538362d426967666f6e7400");

  const openFont = _OpenFont([]);
  expect(openFont(dataView, 0, null)).not.toThrowError()
});
