import MessageBuilder from "./MessageBuilder";

export default function _ListFonts() {
  return function ListFonts(dataView: DataView, sequenceNumber: number, ws: WebSocket) {
    const maxNames = dataView.getUint16(4);

    const lengthOfPattern = dataView.getUint16(6);
    const textDecoder = new TextDecoder();
    const pattern = textDecoder.decode(dataView.buffer.slice(8, 8 + lengthOfPattern));

    const fonts = filterFontsByName(fontsList, pattern);
    console.log("SENDING FONTS", fonts)

    const response = MessageBuilder.Reply(sequenceNumber, dataView.getUint16(2) - 2);
    response.card16(fonts.length);
    response.insertUnusedBytes(22);
    fonts.forEach(font => response.string8(font));
    ws.send(response.build());
  }
}

/**
 *
 * @param fonts Fonts in a fonts.dir format.  See https://www.x.org/archive/X11R7.5/doc/man/man1/mkfontdir.1.html for more details.
 * @param filter
 */
export function filterFontsByName(fonts: string, filter: string){
  const [numberOfFonts, ...lines] = fonts.split("\n");
  return lines.map(lastLine => {
    const [_, name] = lastLine.split(' ');
    return name;
  }).filter(name => matchName(name.toLowerCase(), filter.toLowerCase()));
}

function matchName(name: string, filter: string) {
  if (filter.length == 0){
    return name.length == 0;
  }

  const nameFirstChar = name.charAt(0);
  const filterFirstChar = filter.charAt(0);

  if (filterFirstChar === '*') {
    if(filter.length === 1) {
      return true;
    }
    const nextFilterChar = filter.charAt(1);
    const positionOfSubsequentCharacter = name.indexOf(nextFilterChar);
    if (positionOfSubsequentCharacter < 0) {
      return false;
    }
    return matchName(name.substring(positionOfSubsequentCharacter), filter.substring(1));
  }

  const charsMatch = nameFirstChar == filterFirstChar || filterFirstChar == '?';

  return charsMatch && matchName(name.substr(1), filter.substr(1));
}

export const fontsList = `409
10x20-ISO8859-1.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-1
10x20-ISO8859-10.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-10
10x20-ISO8859-11.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-11
10x20-ISO8859-13.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-13
10x20-ISO8859-14.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-14
10x20-ISO8859-15.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-15
10x20-ISO8859-16.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-16
10x20-ISO8859-2.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-2
10x20-ISO8859-3.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-3
10x20-ISO8859-4.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-4
10x20-ISO8859-5.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-5
10x20-ISO8859-7.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-7
10x20-ISO8859-8.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-8
10x20-ISO8859-9.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso8859-9
10x20-KOI8-R.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-koi8-r
10x20.pcf.gz -misc-fixed-medium-r-normal--20-200-75-75-c-100-iso10646-1
12x13ja.pcf.gz -misc-fixed-medium-r-normal-ja-13-120-75-75-c-120-iso10646-1
12x24.pcf.gz -sony-fixed-medium-r-normal--24-170-100-100-c-120-iso8859-1
12x24rk.pcf.gz -sony-fixed-medium-r-normal--24-170-100-100-c-120-jisx0201.1976-0
18x18ja.pcf.gz -misc-fixed-medium-r-normal-ja-18-120-100-100-c-180-iso10646-1
18x18ko.pcf.gz -misc-fixed-medium-r-normal-ko-18-120-100-100-c-180-iso10646-1
4x6-ISO8859-1.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-1
4x6-ISO8859-10.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-10
4x6-ISO8859-13.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-13
4x6-ISO8859-14.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-14
4x6-ISO8859-15.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-15
4x6-ISO8859-16.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-16
4x6-ISO8859-2.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-2
4x6-ISO8859-3.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-3
4x6-ISO8859-4.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-4
4x6-ISO8859-5.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-5
4x6-ISO8859-7.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-7
4x6-ISO8859-8.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-8
4x6-ISO8859-9.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso8859-9
4x6-KOI8-R.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-koi8-r
4x6.pcf.gz -misc-fixed-medium-r-normal--6-60-75-75-c-40-iso10646-1
5x7-ISO8859-1.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-1
5x7-ISO8859-10.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-10
5x7-ISO8859-13.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-13
5x7-ISO8859-14.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-14
5x7-ISO8859-15.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-15
5x7-ISO8859-16.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-16
5x7-ISO8859-2.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-2
5x7-ISO8859-3.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-3
5x7-ISO8859-4.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-4
5x7-ISO8859-5.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-5
5x7-ISO8859-7.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-7
5x7-ISO8859-8.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-8
5x7-ISO8859-9.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso8859-9
5x7-KOI8-R.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-koi8-r
5x7.pcf.gz -misc-fixed-medium-r-normal--7-70-75-75-c-50-iso10646-1
5x8-ISO8859-1.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-1
5x8-ISO8859-10.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-10
5x8-ISO8859-13.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-13
5x8-ISO8859-14.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-14
5x8-ISO8859-15.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-15
5x8-ISO8859-16.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-16
5x8-ISO8859-2.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-2
5x8-ISO8859-3.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-3
5x8-ISO8859-4.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-4
5x8-ISO8859-5.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-5
5x8-ISO8859-7.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-7
5x8-ISO8859-8.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-8
5x8-ISO8859-9.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso8859-9
5x8-KOI8-R.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-koi8-r
5x8.pcf.gz -misc-fixed-medium-r-normal--8-80-75-75-c-50-iso10646-1
6x10-ISO8859-1.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-1
6x10-ISO8859-10.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-10
6x10-ISO8859-13.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-13
6x10-ISO8859-14.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-14
6x10-ISO8859-15.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-15
6x10-ISO8859-16.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-16
6x10-ISO8859-2.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-2
6x10-ISO8859-3.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-3
6x10-ISO8859-4.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-4
6x10-ISO8859-5.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-5
6x10-ISO8859-7.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-7
6x10-ISO8859-8.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-8
6x10-ISO8859-9.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso8859-9
6x10-KOI8-R.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-koi8-r
6x10.pcf.gz -misc-fixed-medium-r-normal--10-100-75-75-c-60-iso10646-1
6x12-ISO8859-1.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-1
6x12-ISO8859-10.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-10
6x12-ISO8859-13.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-13
6x12-ISO8859-14.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-14
6x12-ISO8859-15.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-15
6x12-ISO8859-16.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-16
6x12-ISO8859-2.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-2
6x12-ISO8859-3.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-3
6x12-ISO8859-4.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-4
6x12-ISO8859-5.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-5
6x12-ISO8859-7.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-7
6x12-ISO8859-8.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-8
6x12-ISO8859-9.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso8859-9
6x12-KOI8-R.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-koi8-r
6x12.pcf.gz -misc-fixed-medium-r-semicondensed--12-110-75-75-c-60-iso10646-1
6x13-ISO8859-1.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-1
6x13-ISO8859-10.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-10
6x13-ISO8859-11.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-11
6x13-ISO8859-13.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-13
6x13-ISO8859-14.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-14
6x13-ISO8859-15.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-15
6x13-ISO8859-16.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-16
6x13-ISO8859-2.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-2
6x13-ISO8859-3.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-3
6x13-ISO8859-4.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-4
6x13-ISO8859-5.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-5
6x13-ISO8859-7.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-7
6x13-ISO8859-8.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-8
6x13-ISO8859-9.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso8859-9
6x13-KOI8-R.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-koi8-r
6x13.pcf.gz -misc-fixed-medium-r-semicondensed--13-120-75-75-c-60-iso10646-1
6x13B-ISO8859-1.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-1
6x13B-ISO8859-10.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-10
6x13B-ISO8859-13.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-13
6x13B-ISO8859-14.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-14
6x13B-ISO8859-15.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-15
6x13B-ISO8859-16.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-16
6x13B-ISO8859-2.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-2
6x13B-ISO8859-3.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-3
6x13B-ISO8859-4.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-4
6x13B-ISO8859-5.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-5
6x13B-ISO8859-7.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-7
6x13B-ISO8859-8.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-8
6x13B-ISO8859-9.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso8859-9
6x13B.pcf.gz -misc-fixed-bold-r-semicondensed--13-120-75-75-c-60-iso10646-1
6x13O-ISO8859-1.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-1
6x13O-ISO8859-10.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-10
6x13O-ISO8859-13.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-13
6x13O-ISO8859-14.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-14
6x13O-ISO8859-15.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-15
6x13O-ISO8859-16.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-16
6x13O-ISO8859-2.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-2
6x13O-ISO8859-3.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-3
6x13O-ISO8859-4.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-4
6x13O-ISO8859-5.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-5
6x13O-ISO8859-7.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-7
6x13O-ISO8859-9.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso8859-9
6x13O.pcf.gz -misc-fixed-medium-o-semicondensed--13-120-75-75-c-60-iso10646-1
6x9-ISO8859-1.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-1
6x9-ISO8859-10.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-10
6x9-ISO8859-13.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-13
6x9-ISO8859-14.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-14
6x9-ISO8859-15.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-15
6x9-ISO8859-16.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-16
6x9-ISO8859-2.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-2
6x9-ISO8859-3.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-3
6x9-ISO8859-4.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-4
6x9-ISO8859-5.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-5
6x9-ISO8859-7.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-7
6x9-ISO8859-8.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-8
6x9-ISO8859-9.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso8859-9
6x9-KOI8-R.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-koi8-r
6x9.pcf.gz -misc-fixed-medium-r-normal--9-90-75-75-c-60-iso10646-1
7x13-ISO8859-1.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-1
7x13-ISO8859-10.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-10
7x13-ISO8859-11.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-11
7x13-ISO8859-13.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-13
7x13-ISO8859-14.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-14
7x13-ISO8859-15.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-15
7x13-ISO8859-16.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-16
7x13-ISO8859-2.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-2
7x13-ISO8859-3.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-3
7x13-ISO8859-4.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-4
7x13-ISO8859-5.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-5
7x13-ISO8859-7.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-7
7x13-ISO8859-8.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-8
7x13-ISO8859-9.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso8859-9
7x13-KOI8-R.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-koi8-r
7x13.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-70-iso10646-1
7x13B-ISO8859-1.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-1
7x13B-ISO8859-10.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-10
7x13B-ISO8859-11.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-11
7x13B-ISO8859-13.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-13
7x13B-ISO8859-14.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-14
7x13B-ISO8859-15.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-15
7x13B-ISO8859-16.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-16
7x13B-ISO8859-2.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-2
7x13B-ISO8859-3.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-3
7x13B-ISO8859-4.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-4
7x13B-ISO8859-5.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-5
7x13B-ISO8859-7.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-7
7x13B-ISO8859-8.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-8
7x13B-ISO8859-9.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso8859-9
7x13B.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-70-iso10646-1
7x13O-ISO8859-1.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-1
7x13O-ISO8859-10.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-10
7x13O-ISO8859-11.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-11
7x13O-ISO8859-13.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-13
7x13O-ISO8859-14.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-14
7x13O-ISO8859-15.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-15
7x13O-ISO8859-16.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-16
7x13O-ISO8859-2.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-2
7x13O-ISO8859-3.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-3
7x13O-ISO8859-4.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-4
7x13O-ISO8859-5.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-5
7x13O-ISO8859-7.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-7
7x13O-ISO8859-9.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso8859-9
7x13O.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-70-iso10646-1
7x14-ISO8859-1.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-1
7x14-ISO8859-10.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-10
7x14-ISO8859-11.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-11
7x14-ISO8859-13.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-13
7x14-ISO8859-14.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-14
7x14-ISO8859-15.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-15
7x14-ISO8859-16.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-16
7x14-ISO8859-2.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-2
7x14-ISO8859-3.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-3
7x14-ISO8859-4.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-4
7x14-ISO8859-5.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-5
7x14-ISO8859-7.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-7
7x14-ISO8859-8.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-8
7x14-ISO8859-9.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso8859-9
7x14-JISX0201.1976-0.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-jisx0201.1976-0
7x14-KOI8-R.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-koi8-r
7x14.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-70-iso10646-1
7x14B-ISO8859-1.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-1
7x14B-ISO8859-10.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-10
7x14B-ISO8859-11.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-11
7x14B-ISO8859-13.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-13
7x14B-ISO8859-14.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-14
7x14B-ISO8859-15.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-15
7x14B-ISO8859-16.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-16
7x14B-ISO8859-2.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-2
7x14B-ISO8859-3.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-3
7x14B-ISO8859-4.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-4
7x14B-ISO8859-5.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-5
7x14B-ISO8859-7.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-7
7x14B-ISO8859-8.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-8
7x14B-ISO8859-9.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso8859-9
7x14B.pcf.gz -misc-fixed-bold-r-normal--14-130-75-75-c-70-iso10646-1
8x13-ISO8859-1.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-1
8x13-ISO8859-10.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-10
8x13-ISO8859-13.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-13
8x13-ISO8859-14.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-14
8x13-ISO8859-15.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-15
8x13-ISO8859-16.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-16
8x13-ISO8859-2.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-2
8x13-ISO8859-3.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-3
8x13-ISO8859-4.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-4
8x13-ISO8859-5.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-5
8x13-ISO8859-7.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-7
8x13-ISO8859-8.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-8
8x13-ISO8859-9.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso8859-9
8x13-KOI8-R.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-koi8-r
8x13.pcf.gz -misc-fixed-medium-r-normal--13-120-75-75-c-80-iso10646-1
8x13B-ISO8859-1.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-1
8x13B-ISO8859-10.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-10
8x13B-ISO8859-13.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-13
8x13B-ISO8859-14.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-14
8x13B-ISO8859-15.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-15
8x13B-ISO8859-16.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-16
8x13B-ISO8859-2.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-2
8x13B-ISO8859-3.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-3
8x13B-ISO8859-4.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-4
8x13B-ISO8859-5.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-5
8x13B-ISO8859-7.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-7
8x13B-ISO8859-8.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-8
8x13B-ISO8859-9.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso8859-9
8x13B.pcf.gz -misc-fixed-bold-r-normal--13-120-75-75-c-80-iso10646-1
8x13O-ISO8859-1.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-1
8x13O-ISO8859-10.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-10
8x13O-ISO8859-13.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-13
8x13O-ISO8859-14.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-14
8x13O-ISO8859-15.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-15
8x13O-ISO8859-16.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-16
8x13O-ISO8859-2.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-2
8x13O-ISO8859-3.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-3
8x13O-ISO8859-4.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-4
8x13O-ISO8859-5.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-5
8x13O-ISO8859-7.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-7
8x13O-ISO8859-9.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso8859-9
8x13O.pcf.gz -misc-fixed-medium-o-normal--13-120-75-75-c-80-iso10646-1
8x16.pcf.gz -sony-fixed-medium-r-normal--16-120-100-100-c-80-iso8859-1
8x16rk.pcf.gz -sony-fixed-medium-r-normal--16-120-100-100-c-80-jisx0201.1976-0
9x15-ISO8859-1.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-1
9x15-ISO8859-10.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-10
9x15-ISO8859-11.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-11
9x15-ISO8859-13.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-13
9x15-ISO8859-14.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-14
9x15-ISO8859-15.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-15
9x15-ISO8859-16.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-16
9x15-ISO8859-2.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-2
9x15-ISO8859-3.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-3
9x15-ISO8859-4.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-4
9x15-ISO8859-5.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-5
9x15-ISO8859-7.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-7
9x15-ISO8859-8.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-8
9x15-ISO8859-9.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso8859-9
9x15-KOI8-R.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-koi8-r
9x15.pcf.gz -misc-fixed-medium-r-normal--15-140-75-75-c-90-iso10646-1
9x15B-ISO8859-1.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-1
9x15B-ISO8859-10.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-10
9x15B-ISO8859-11.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-11
9x15B-ISO8859-13.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-13
9x15B-ISO8859-14.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-14
9x15B-ISO8859-15.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-15
9x15B-ISO8859-16.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-16
9x15B-ISO8859-2.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-2
9x15B-ISO8859-3.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-3
9x15B-ISO8859-4.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-4
9x15B-ISO8859-5.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-5
9x15B-ISO8859-7.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-7
9x15B-ISO8859-8.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-8
9x15B-ISO8859-9.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso8859-9
9x15B.pcf.gz -misc-fixed-bold-r-normal--15-140-75-75-c-90-iso10646-1
9x18-ISO8859-1.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-1
9x18-ISO8859-10.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-10
9x18-ISO8859-11.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-11
9x18-ISO8859-13.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-13
9x18-ISO8859-14.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-14
9x18-ISO8859-15.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-15
9x18-ISO8859-16.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-16
9x18-ISO8859-2.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-2
9x18-ISO8859-3.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-3
9x18-ISO8859-4.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-4
9x18-ISO8859-5.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-5
9x18-ISO8859-7.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-7
9x18-ISO8859-8.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-8
9x18-ISO8859-9.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso8859-9
9x18-KOI8-R.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-koi8-r
9x18.pcf.gz -misc-fixed-medium-r-normal--18-120-100-100-c-90-iso10646-1
9x18B-ISO8859-1.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-1
9x18B-ISO8859-10.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-10
9x18B-ISO8859-13.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-13
9x18B-ISO8859-14.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-14
9x18B-ISO8859-15.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-15
9x18B-ISO8859-16.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-16
9x18B-ISO8859-2.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-2
9x18B-ISO8859-3.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-3
9x18B-ISO8859-4.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-4
9x18B-ISO8859-5.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-5
9x18B-ISO8859-7.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-7
9x18B-ISO8859-8.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-8
9x18B-ISO8859-9.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso8859-9
9x18B.pcf.gz -misc-fixed-bold-r-normal--18-120-100-100-c-90-iso10646-1
arabic24.pcf.gz -arabic-newspaper-medium-r-normal--32-246-100-100-p-137-iso10646-1
clB6x10.pcf.gz -schumacher-clean-bold-r-normal--10-100-75-75-c-60-iso646.1991-irv
clB6x12.pcf.gz -schumacher-clean-bold-r-normal--12-120-75-75-c-60-iso646.1991-irv
clB8x10.pcf.gz -schumacher-clean-bold-r-normal--10-100-75-75-c-80-iso646.1991-irv
clB8x12.pcf.gz -schumacher-clean-bold-r-normal--12-120-75-75-c-80-iso646.1991-irv
clB8x13.pcf.gz -schumacher-clean-bold-r-normal--13-130-75-75-c-80-iso646.1991-irv
clB8x14.pcf.gz -schumacher-clean-bold-r-normal--14-140-75-75-c-80-iso646.1991-irv
clB8x16.pcf.gz -schumacher-clean-bold-r-normal--16-160-75-75-c-80-iso646.1991-irv
clB8x8.pcf.gz -schumacher-clean-bold-r-normal--8-80-75-75-c-80-iso646.1991-irv
clB9x15.pcf.gz -schumacher-clean-bold-r-normal--15-150-75-75-c-90-iso646.1991-irv
clI6x12.pcf.gz -schumacher-clean-medium-i-normal--12-120-75-75-c-60-iso646.1991-irv
clI8x8.pcf.gz -schumacher-clean-medium-i-normal--8-80-75-75-c-80-iso646.1991-irv
clR4x6.pcf.gz -schumacher-clean-medium-r-normal--6-60-75-75-c-40-iso646.1991-irv
clR5x10.pcf.gz -schumacher-clean-medium-r-normal--10-100-75-75-c-50-iso646.1991-irv
clR5x6.pcf.gz -schumacher-clean-medium-r-normal--6-60-75-75-c-50-iso646.1991-irv
clR5x8.pcf.gz -schumacher-clean-medium-r-normal--8-80-75-75-c-50-iso646.1991-irv
clR6x10.pcf.gz -schumacher-clean-medium-r-normal--10-100-75-75-c-60-iso646.1991-irv
clR6x12-ISO8859-1.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-1
clR6x12-ISO8859-10.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-10
clR6x12-ISO8859-13.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-13
clR6x12-ISO8859-14.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-14
clR6x12-ISO8859-15.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-15
clR6x12-ISO8859-16.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-16
clR6x12-ISO8859-2.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-2
clR6x12-ISO8859-3.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-3
clR6x12-ISO8859-4.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-4
clR6x12-ISO8859-5.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-5
clR6x12-ISO8859-7.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-7
clR6x12-ISO8859-8.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-8
clR6x12-ISO8859-9.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso8859-9
clR6x12-KOI8-R.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-koi8-r
clR6x12.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-60-iso10646-1
clR6x13.pcf.gz -schumacher-clean-medium-r-normal--13-130-75-75-c-60-iso646.1991-irv
clR6x6.pcf.gz -schumacher-clean-medium-r-normal--6-60-75-75-c-60-iso646.1991-irv
clR6x8.pcf.gz -schumacher-clean-medium-r-normal--8-80-75-75-c-60-iso646.1991-irv
clR7x10.pcf.gz -schumacher-clean-medium-r-normal--10-100-75-75-c-70-iso646.1991-irv
clR7x12.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-70-iso646.1991-irv
clR7x14.pcf.gz -schumacher-clean-medium-r-normal--14-140-75-75-c-70-iso646.1991-irv
clR7x8.pcf.gz -schumacher-clean-medium-r-normal--8-80-75-75-c-70-iso646.1991-irv
clR8x10.pcf.gz -schumacher-clean-medium-r-normal--10-100-75-75-c-80-iso646.1991-irv
clR8x12.pcf.gz -schumacher-clean-medium-r-normal--12-120-75-75-c-80-iso646.1991-irv
clR8x13.pcf.gz -schumacher-clean-medium-r-normal--13-130-75-75-c-80-iso646.1991-irv
clR8x14.pcf.gz -schumacher-clean-medium-r-normal--14-140-75-75-c-80-iso646.1991-irv
clR8x16.pcf.gz -schumacher-clean-medium-r-normal--16-160-75-75-c-80-iso646.1991-irv
clR8x8.pcf.gz -schumacher-clean-medium-r-normal--8-80-75-75-c-80-iso646.1991-irv
clR9x15.pcf.gz -schumacher-clean-medium-r-normal--15-150-75-75-c-90-iso646.1991-irv
cu-alt12.pcf.gz -mutt-clearlyu alternate glyphs-medium-r-normal--17-120-100-100-p-122-iso10646-1
cu-arabic12.pcf.gz -mutt-clearlyu arabic extra-medium-r-normal--17-120-100-100-p-101-fontspecific-0
cu-devnag12.pcf.gz -mutt-clearlyu devangari extra-medium-r-normal--17-120-100-100-p-105-fontspecific-0
cu-lig12.pcf.gz -mutt-clearlyu ligature-medium-r-normal--17-120-100-100-p-141-fontspecific-0
cu-pua12.pcf.gz -mutt-clearlyu pua-medium-r-normal--17-120-100-100-p-110-iso10646-1
cu12.pcf.gz -mutt-clearlyu-medium-r-normal--17-120-100-100-p-123-iso10646-1
cuarabic12.pcf.gz -mutt-clearlyu arabic-medium-r-normal--17-120-100-100-p-93-iso10646-1
cudevnag12.pcf.gz -mutt-clearlyu devanagari-medium-r-normal--15-120-90-90-p-104-fontspecific-0
cursor.pcf.gz cursor
deccurs.pcf.gz decw$cursor
decsess.pcf.gz decw$session
gb16fs.pcf.gz -isas-fangsong ti-medium-r-normal--16-160-72-72-c-160-gb2312.1980-0
gb16st.pcf.gz -isas-song ti-medium-r-normal--16-160-72-72-c-160-gb2312.1980-0
gb24st.pcf.gz -isas-song ti-medium-r-normal--24-240-72-72-c-240-gb2312.1980-0
hanglg16.pcf.gz -daewoo-gothic-medium-r-normal--16-120-100-100-c-160-ksc5601.1987-0
hanglm16.pcf.gz -daewoo-mincho-medium-r-normal--16-120-100-100-c-160-ksc5601.1987-0
hanglm24.pcf.gz -daewoo-mincho-medium-r-normal--24-170-100-100-c-240-ksc5601.1987-0
jiskan16.pcf.gz -jis-fixed-medium-r-normal--16-150-75-75-c-160-jisx0208.1983-0
jiskan24.pcf.gz -jis-fixed-medium-r-normal--24-230-75-75-c-240-jisx0208.1983-0
k14.pcf.gz -misc-fixed-medium-r-normal--14-130-75-75-c-140-jisx0208.1983-0
micro.pcf.gz micro
nil2.pcf.gz -misc-nil-medium-r-normal--2-20-75-75-c-10-misc-fontspecific
olcursor.pcf.gz -sun-open look cursor-----12-120-75-75-p-160-sunolcursor-1
olgl10.pcf.gz -sun-open look glyph-----10-100-75-75-p-101-sunolglyph-1
olgl12.pcf.gz -sun-open look glyph-----12-120-75-75-p-113-sunolglyph-1
olgl14.pcf.gz -sun-open look glyph-----14-140-75-75-p-128-sunolglyph-1
olgl19.pcf.gz -sun-open look glyph-----19-190-75-75-p-154-sunolglyph-1`
