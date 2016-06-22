'use strict';

var clientID = ["1466584765725","1466584765726"];
var noOfClients = 0;

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'indexx.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  ws.clientId = new Date().getTime();//Setting id for each client
  console.log('Client connected --- ID :'+ws.clientId);
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
    //console.log("Client ID ::"+client.clientId);
  });

}, 1000);
