const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8020/socket/topic/connections/');

ws.on('open', function open() {
  ws.send('power rangers');
});

ws.on('message', function incoming(message) {
  console.log('received: %s', message);
});