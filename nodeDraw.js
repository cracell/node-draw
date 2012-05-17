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
  case '/nodeDrawClient.js':
    fs.readFile(__dirname + path, function(err, data){
      if (err) return send404(res);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
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

server.listen(8080);

// socket.io, let's eat some cake!
var io = require(__dirname + '/node_modules/socket.io').listen(server);

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
  
  socket.on('nachos', function(text) {
    socket.broadcast.emit('nachos', text)
  });
});
