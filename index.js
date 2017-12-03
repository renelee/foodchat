var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

users = [];
var locations = {};
io.on('connection', function(socket){
	socket.on('setUsername', function(data) {
		name = data.split(';');
	  if(users.indexOf(name[0]) > -1) {
	  	socket.emit('userExists', name[0] + ' username is taken! Try some other username.');
	  } else {
		users.push(name[0]);
		locations[name[0]] = name[1]
		socket.emit('userSet', {username: name[0]});
	  }
	})

	socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   	})
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

