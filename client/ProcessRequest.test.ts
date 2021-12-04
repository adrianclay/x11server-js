import {_processPacket, _processRequest} from "./ProcessRequest";

xtest('with both a CreateGC and GetProperty in 1 DataView', () => {
  const send = jest.fn();

  const bytes = new Uint8Array("3700060000000000020000000c000000ffffff00000000001400060002000000170000001f0000000000000000e1f505".match(/../g).map(s => Number.parseInt(s, 16)))
  _processRequest(new DataView(bytes.buffer), {send});

  expect(send).toBeCalledTimes(1);
});

describe('processPacket', () => {
  test('called with a packet containing 3 requests calls processRequest 3 times', () => {
    const processRequest = jest.fn();
    const processPacket = _processPacket(processRequest);
    const webSocket = jest.fn();

    const fakeRequest = [1, 1, 1, 0];

    const packetMadeOfThreeRequests = new Uint8Array([].concat(fakeRequest).concat(fakeRequest).concat(fakeRequest));
    processPacket(new DataView(packetMadeOfThreeRequests.buffer), webSocket);

    expect(processRequest).toBeCalledTimes(3);
  });
});

describe('processRequest', () => {
  test('It sends an error packet on error', () => {
    const webSocket = jest.fn();
    const processRequest = _processRequest({ 1: () => { throw new Error('Name'); } });
    const fakeRequest = [1, 1, 1, 0];
    processRequest(new DataView(new Uint8Array(fakeRequest).buffer), { send: webSocket });

    expect(webSocket).toBeCalledTimes(1);
    expect(new Uint8Array(webSocket.mock.calls[0][0])).toMatchSnapshot();
  })
});
