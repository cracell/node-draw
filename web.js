var http = require('http'), 
    url = require('url'),
    fs = require('fs'),
    server;

server = http.createServer(function(req, res){
  // server code
  var path = url.parse(req.url).pathname;
  switch (path){
  case '/':
    fs.readFile(__dirname + '/nodeDraw.html', function(err, data){
      if (err) return send404(res);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data, 'utf8');
      res.end();
    });
    break;
  case '/nodeWatch.html':
    fs.readFile(__dirname + path, function(err, data){
      if (err) return send404(res);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data, 'utf8');
        res.end();
      });
    break;
  case '/nodeDrawClient.js':
    fs.readFile(__dirname + path, function(err, data){
      if (err) return send404(res);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data, 'utf8');
        res.end();
      });
    break;
  case '/sounds/meow11.wav':
    fs.readFile(__dirname + path, function(err, data){
      if (err) return send404(res);
        res.writeHead(200, {'Content-Type': 'audio/wav'});
        res.write(data, 'utf8');
        res.end();
      });
    break;
  default: send404(res);
  }
}),

send404 = function(res) {
  res.writeHead(404);
  res.write('404');
  res.end();
};

var port = process.env.PORT || 8000;
server.listen(port);

// socket.io, let's eat some cake!
var io = require('socket.io').listen(server);

// on a 'connetion' event
io.sockets.on('connection', function(socket) {
  console.log('Connection ' + socket.id + " accepted.");

  // now that we have our connect 'socket' object, we can
  // define its event handlers
  socket.on('message', function(message){
    console.log("Received message: " + message + " - from client " + socket.io);
  });

  socket.on('disconnect', function() {
    console.log("Connection " + socket.id + " terminated.");
  });
  
  socket.on('drawPoints', function(points) {
    socket.broadcast.emit('drawPoints', points)
  });
  
  socket.on('colorChange', function(color) {
    socket.broadcast.emit('colorChange', color)
  });
  
  socket.on('sizeChange', function(size) {
    socket.broadcast.emit('sizeChange', size);
  });
  
  socket.on('playMeow', function() {
    socket.broadcast.emit('playMeow', 'ok');
  });
});


//Code for Heroku config
// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
