'use strict';

var clientID = ["1466584765725","1466584765726"];
var noOfClients = 0;

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

// var pg = require('pg');
// pg.defaults.ssl = true;
//
// pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//    client.query('SELECT * FROM onlineUsers', function(err, result) {
//       done();
//       if(err) return console.error(err);
//       console.log(result.rows);
//    });
// });

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'indexx.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

//---------
function SebdDataToClient(msg, client_ID){
  var opponentPlayer = null;
  switch (client_ID) {
    case clientID[0]: opponentPlayer = clientID[1];
      break;
    case clientID[1]: opponentPlayer = clientID[0];
      break;
  }

  wss.clients.forEach((client) => {
      //console.log("Client ID ::"+client.clientId);
      if(client.clientId == opponentPlayer){
          client.send("Player: "+client_ID+" Data: "+msg);
      }
  });

}
//---------
wss.on('connection', (ws) => {
  //ws.clientId = new Date().getTime();//Setting id for each client
  if(noOfClients < 2){
    ws.clientId = clientID[noOfClients];
    noOfClients++;
  }else{
    ws.clientId = new Date().getTime();//Setting id for each client
  }
  console.log('Client connected --- ID :'+ws.clientId);

  ws.on('message',(msg) =>{
    console.log("Got msg :::" + msg);
    SebdDataToClient(msg,ws.clientId);
  });

  ws.on('close', () => console.log('Client disconnected'));
});

/*setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
    //console.log("Client ID ::"+client.clientId);
  });

}, 1000);*/
