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
      //var coordinates = getLocation();
      var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="
      // make location request
      https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
      url += "-33.8670522,151.1957362"
      url += "&radius=500&type=restaurant&key="
      url += place_api
      request(url, { json: true }, (err, res, body) => {
		  if (err) { return console.log(err); }
		  var results = body.results;
		  var restaurantNames = [];
		  for (var i=0; i<5; i++) {
		  	restaurantNames.push(results[i].name);
		  }
		  suggestionsCount += 1;
		  var suggestionsId = "suggestions" + suggestionsCount.toString();
		  var data = {restaurantNames: restaurantNames, suggestionsId: suggestionsId};
		  io.sockets.emit('suggestions', data);

		  // for (i = 0; i < results.length; i++) {
		  // 	console.log(results[i].name)
		  // 	io.sockets.emit('newmsg', results[i].name)
		  // 	restaurants.push(results[i.name])
		  // }
		  //io.sockets.emit('newmsg', results[0].name);
		});
   	})
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

