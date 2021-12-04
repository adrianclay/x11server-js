import MessageBuilder from "./MessageBuilder";
import { TextDecoder } from 'util';

describe('Reply with zero length', () => {
  const sequenceNumber = 1536;
  const middleByteThing = 127;
  const messageBuilder = MessageBuilder.Reply(sequenceNumber, 0, middleByteThing);

  test('sets the first byte to 1', () => {
    expect(uint8Array(messageBuilder)[0]).toEqual(1);
  });

  test('creates a message of minimum length 32 bytes', () => {
    expect(messageBuilder.build().byteLength).toEqual(32);
  });

  test('sets the sequenceNumber as an unsigned 16-bit integer at byte offset 2', () => {
    expect(dataView(messageBuilder).getUint16(2, true)).toEqual(sequenceNumber);
  });

  test('sets the second byte to the middle byte', () => {
    expect(uint8Array(messageBuilder)[1]).toEqual(middleByteThing);
  });

  test('sets the reply length as 0', () => {
    expect(dataView(messageBuilder).getUint32(4, true)).toEqual(0);
  });
});

describe('Without specifying a middle byte', () => {
  const messageBuilder = MessageBuilder.Reply(180, 0);
  test('sets the second byte to zero', () => {
    expect(uint8Array(messageBuilder)[1]).toEqual(0);
  });
});

describe('Message building type sets the value, and increments the buffer position offset', () => {
  let messageBuilder : MessageBuilder;
  beforeEach(() => messageBuilder = MessageBuilder.Reply(199, 0));

  test('bool', () => {
    messageBuilder.bool(true);
    messageBuilder.bool(false);
    messageBuilder.bool(true);

    expect(uint8Array(messageBuilder)[8]).toBe(1);
    expect(uint8Array(messageBuilder)[9]).toBe(0);
    expect(uint8Array(messageBuilder)[10]).toBe(1);
  });

  test('card16', () => {
    messageBuilder.card16(1);
    messageBuilder.card16(2);
    messageBuilder.card16(3);

    expect(dataView(messageBuilder).getUint16(8, true)).toBe(1);
    expect(dataView(messageBuilder).getUint16(10, true)).toBe(2);
    expect(dataView(messageBuilder).getUint16(12, true)).toBe(3);
  });

  test('window', () => {
    messageBuilder.window(10);
    messageBuilder.window(20);
    messageBuilder.window(30);

    expect(dataView(messageBuilder).getUint32(8, true)).toBe(10);
    expect(dataView(messageBuilder).getUint32(12, true)).toBe(20);
    expect(dataView(messageBuilder).getUint32(16, true)).toBe(30);
  });

  test('int16', () => {
    messageBuilder.int16(-100);
    messageBuilder.int16(200);
    messageBuilder.int16(-300);

    expect(dataView(messageBuilder).getInt16(8, true)).toBe(-100);
    expect(dataView(messageBuilder).getInt16(10, true)).toBe(200);
    expect(dataView(messageBuilder).getInt16(12, true)).toBe(-300);
  });

  test('card32', () => {
    messageBuilder.card32(-100);
    messageBuilder.card32(200);
    messageBuilder.card32(-300);

    expect(dataView(messageBuilder).getInt16(8, true)).toBe(-100);
    expect(dataView(messageBuilder).getInt16(12, true)).toBe(200);
    expect(dataView(messageBuilder).getInt16(16, true)).toBe(-300);
  });

  test('string8', () => {
    messageBuilder.string8("a");
    messageBuilder.string8("bc");
    messageBuilder.string8("d");

    expect(new TextDecoder().decode(messageBuilder.build().slice(8, 12))).toEqual("abcd");
  });

});

describe('Reply with length 1', () => {
  const messageBuilder = MessageBuilder.Reply(0, 1);
  test('Sets the length byte', () => {
    expect(dataView(messageBuilder).getUint32(4, true)).toEqual(1);
  });

  test('Builds an array of length 32 + 4', () => {
    expect(messageBuilder.build().byteLength).toEqual(32 + 4);
  });
});

describe('Event', () => {
  const eventCode = 20;
  const sequenceNumber = 9988;
  const messageBuilder = MessageBuilder.Event(sequenceNumber, eventCode);

  test('creates a message with length 32', () => {
    expect(messageBuilder.build().byteLength).toEqual(32);
  });

  test('sets the first byte to the code', () => {
    expect(dataView(messageBuilder).getUint8(0)).toEqual(eventCode);
  });

  test('sets the 3-4 byte to the sequence number', () => {
    expect(dataView(messageBuilder).getUint16(2, true)).toEqual(sequenceNumber);
  });

  test('starts the offset at 4', () => {
    messageBuilder.bool(true);
    expect(dataView(messageBuilder).getUint8(4)).toEqual(1);
  })
});

const uint8Array = (messageBuilder : MessageBuilder) => new Uint8Array(messageBuilder.build());
const dataView = (messageBuilder : MessageBuilder) => new DataView(messageBuilder.build());
