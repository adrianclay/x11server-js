import _ListFonts, {filterFontsByName, fontsList} from "./ListFonts";

function generateFontFile(names: string[]) {
  const stringified_names = names.map(name => `${name} ${name}`).join("\n");
  return `${names.length}\n${stringified_names}`;
}

describe(filterFontsByName, () => {
  test('Blank fonts list', () => {
    expect(filterFontsByName('', '')).toEqual([]);
  });

  test('Exact match returns name', () => {
    expect(filterFontsByName(generateFontFile(['blah']), "blah")).toEqual(['blah']);
  });

  test('Case match is insensitive', () => {
    expect(filterFontsByName(generateFontFile(['blah']), "BLAH")).toEqual(['blah']);
  });

  test('* matches all entries', () => {
    expect(filterFontsByName(generateFontFile(['blah', 'yah']), "*")).toEqual(['blah', 'yah']);
  });

  test('bla* matches blah', () => {
    expect(filterFontsByName(generateFontFile(['blah', 'yah']), "bla*")).toEqual(['blah']);
  });

  test('b*a* matches blah', () => {
    expect(filterFontsByName(generateFontFile(['blah', 'yah']), "b*a*")).toEqual(['blah']);
  });

  test('b*z* does not match blah', () => {
    expect(filterFontsByName(generateFontFile(['blah', 'yah']), "b*z*")).toEqual([]);
  });

  test('Does not match a fontname longer than the filter', () => {
    expect(filterFontsByName(generateFontFile(['blah']), "bla")).toEqual([]);
  });

  test('Filters out not matching line', () => {
    expect(filterFontsByName(generateFontFile(['blah']), "bz")).toEqual([]);
  });

  test('Matches a question mark', () => {
    expect(filterFontsByName(generateFontFile(['blah']), "b?ah")).toEqual(['blah']);
  });
});
