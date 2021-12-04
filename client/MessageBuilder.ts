// import { TextEncoder } from "util";

export default class MessageBuilder {
  private dataView: DataView;
  private offset: number;

  static Reply(sequenceNumber: number, replyLength: number, middleByteThing: number = 0) {
    const dataView = new DataView(new ArrayBuffer(32 + 4 * replyLength));
    dataView.setUint8(0, 1);
    dataView.setUint8(1, middleByteThing);
    dataView.setUint16(2, sequenceNumber, true);
    dataView.setUint32(4, replyLength, true);
    return new MessageBuilder(dataView, 8);
  }

  static Event(sequenceNumber: number, code: number, middleByteThing: number = 0) {
    const dataView = new DataView(new ArrayBuffer(32));
    dataView.setUint8(0, code);
    dataView.setUint16(2, sequenceNumber, true);
    return new MessageBuilder(dataView, 4);
  }

  private constructor(dataView: DataView, offset: number) {
    this.dataView = dataView;
    this.offset = offset;
  }

  bool(value: boolean){
    this.dataView.setUint8(this.offset++, value ? 1 : 0);
  }

  card16(value: number){
    this.dataView.setUint16(this.offset, value, true);
    this.offset += 2;
  }

  card32(value: number) {
    this.dataView.setUint32(this.offset, value, true);
    this.offset += 4;
  }

  window(value: number){
    this.dataView.setUint32(this.offset, value, true);
    this.offset += 4;
  }

  int16(value: number){
    this.dataView.setInt16(this.offset, value, true);
    this.offset += 2;
  }

  insertUnusedBytes(numberOfBytes: number){

  }

  string8(font: string): void {
    const encoded = new TextEncoder().encode(font);
    const position = new Uint8Array(this.dataView.buffer);
    position.set(encoded, this.offset);
    this.offset += encoded.length;
  }

  build() {
    return this.dataView.buffer;
  }
}
