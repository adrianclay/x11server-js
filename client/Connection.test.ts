import {acceptConnection} from "./Connection";

test('Least significant byte first', () => {
  const send = jest.fn();
  const connectionRequest = new DataView(new ArrayBuffer(10));
  connectionRequest.setUint8(0, 0x6C);

  acceptConnection(connectionRequest, { send } );

  expect(send).toBeCalledTimes(1);
  expect(new Uint8Array(send.mock.calls[0][0])).toMatchSnapshot();
});
