var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const request = require('request');
var place_api = "AIzaSyAYoQ_WGBCemzBx_V-ukr70-6Jy9FpRtzc"
var suggestionsCount = 0;
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

users = [];
var locations = {};
restaurants = []
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
      if (data.message.indexOf("food") == -1 && data.message.indexOf("eat") == -1) {
      	return;
      }
      //var coordinates = getLocation();
      var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="
      // make location request
      url += locations[data.user]
      url += "&radius=500&type=restaurant&key="
      url += place_api
      request(url, { json: true }, (err, res, body) => {
		  if (err) { return console.log(err); }
		  var results = body.results;
		  var restaurantNames = {};
		  for (var i=0; i<5; i++) {
		  	restaurantNames[results[i].name] = results[i].place_id;
		  }
		  suggestionsCount += 1;
		  var suggestionsId = "suggestions" + suggestionsCount.toString();
		  var data = {restaurantNames: restaurantNames, suggestionsId: suggestionsId};
		  io.sockets.emit('suggestions', data);
		});
   	})
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

