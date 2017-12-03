var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

users = [];
io.on('connection', function(socket){
	socket.on('setUsername', function(data) {
	  if(users.indexOf(data) > -1) {
	  	socket.emit('userExists', data + ' username is taken! Try some other username.');
	  } else {
		users.push(data);
		socket.emit('userSet', {username: data});
	  }
	})

	socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   	})

	// socket.on('chat message', function(msg){
	// 	io.emit('chat message', msg);
	// });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
