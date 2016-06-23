'use strict';

var clientID = ["1466584765725","1466584765726"];
var noOfClients = 0;

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

var pg = require('pg');
pg.defaults.ssl = true;

var connectionString = "postgres://exxufairgmxepd:9WQuu8MpVF_TGzsrCXWrKd9ik6@ec2-54-221-226-148.compute-1.amazonaws.com:5432:/d1f2crurbl7a0v"

pg.connect(connectionString, function(err, client, done) {
   client.query('SELECT * FROM onlineUsers', function(err, result) {
      done();
      if(err) return console.error(err);
      console.log(result.rows);
   });
});

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'indexx.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  ws.clientId = new Date().getTime();//Setting id for each client
  console.log('Client connected --- ID :'+ws.clientId);

  ws.on('message',(msg) =>{
    console.log("Got msg :::" + msg);
  });

  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
    //console.log("Client ID ::"+client.clientId);
  });

}, 1000);
