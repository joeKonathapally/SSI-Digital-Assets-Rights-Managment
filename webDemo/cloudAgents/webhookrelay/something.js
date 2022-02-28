var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

let port=process.env.PORT || 3000;

// if(!(process.argv[2]===undefined)){
//   port=process.argv[2];
// }

app.use(express.json());

let clients=[];

app.use('/hook/*', function(req, res){
  console.log('Received Hook from URL: '+req.params[0]);
  console.log(req.body);
  for(var i=0; i<clients.length;i++){
    if(req.params[0] === clients[i].endpoint){
      clients[i].ws.send(JSON.stringify(req.body));
    }
  }
  res.end();
});

app.ws('/socket/*', function(ws, req) {
  console.log('Client subscribed to URL: '+req.params[0]);
  let obj = {
    endpoint: '/'+req.params[0]+'/',
    ws: ws
  };
  clients.push(obj);
  console.log('New client connected!');
  ws.on('message', function(msg) {
    console.log(msg);
  });
});

app.listen(port, () => {
  console.log('Webhook relay server listening on port '+port+'...');
});