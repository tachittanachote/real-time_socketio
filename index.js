var fs = require('fs');
var https = require('https');
var express = require('express');
var app = express();
var functions = require('./components/functions');

require('dotenv').config()

var options = {
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
};

var port = process.env.port;
var ip = process.env.ip;

var server = https.createServer(options, app);

var options={
	cors: {
		origin: "https://www.getspin.me",
	}
}

var io = require('socket.io')(server, options);

io.on('connection', function(socket) {

  console.log(`Client ID ${socket.id} is connected`);

  functions.setOnlineUser(functions.getOnlineUser() + 1);
  io.emit('count', functions.getOnlineUser());

  socket.on('disconnect', (reason) => {
    functions.setOnlineUser(functions.getOnlineUser() - 1);
    io.emit('count', functions.getOnlineUser());
    console.log(`Client ID ${socket.id} is disconnected`);
  });
  
  
});

server.listen(port, function() {
  console.log('Server is listening on %s:%s', ip, port);
});