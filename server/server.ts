import WebSocket from 'ws';
import * as http from 'http';
import express from 'express';
import { Server } from 'net';
import { spawn } from 'child_process';

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);


const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws: WebSocket) {
  const xServer = new Server();
  xServer.listen({ port: '6000' });
  xServer.on('connection', xClient => {
    xClient.on('data', data => {
      console.log(data[0]);
      ws.send(data);
    });
    ws.on('message', (message: Buffer) => {
      console.log('got message to relay', message, 'with length', message.byteLength);
      xClient.write(message);
    });
    xClient.on('error', error => {
      console.log('Erroraroo', error);
    });
  });
  ws.on('close', () => {
    xServer.close();
  });
  xServer.on("listening", () => {
    spawn('/opt/X11/bin/xmessage', ["I LOVE CAKE"], { env: { DISPLAY: 'localhost:1' }, stdio: ['inherit', 'inherit', 'inherit'] });
  });
});

server.listen(8080);
