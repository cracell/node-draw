var socket;
var firstconnect = true;

function connect() {
  if (firstconnect) {
    socket = io.connect(null);

    socket.on('message', function(data) { message(data); });
    socket.on('connect', function() { status_update("Connected to Server"); });
    socket.on('disconnect', function() { status_update("Disconnected from Server"); });
    socket.on('reconnect', function(){ status_update("Reconnected to Server"); });
    socket.on('reconnecting', function( nextRetry ){ status_update("Reconnecting in " + nextRetry + " seconds"); });
    socket.on('reconnect_failed', function() { message("Reconnect Failed"); });
    socket.on('nachos', function(text) { message(text)});
    socket.on('drawPoints', function(points) { drawSpot(points.x, points.y)});

    firstconnect = false;
  } else {
    socket.socket.reconnect();
  }
}

function disconnect() {
  socket.disconnect();
}

function message(data) {
  document.getElementById('message').innerHTML = "Sever says: " + data;
}

function status_update(txt) {
  document.getElementById('status').innerHTML = txt;
}

function esc(msg) {
  return msg.replace(/</g, '&lf;').replace(/>/g, '&gt;');
}

function send() {
  socket.send('Hello server!');
}

function nachos() {
  socket.emit('nachos', "Nachos guys!");
}

function sendDrawPoints(x, y) {
  socket.emit('drawPoints', {x: x, y: y})
}

$(function() {
  connect();
  
  $('#canvas').bind('mousedown', function(e){
    drawSpot(e.clientX, e.clientY);
    sendDrawPoints(e.clientX, e.clientY);
  });
  
  initCanvas();
});

function drawSpot(x, y) {
   context.fillRect(x, y, 10, 10);
}

var context;
function initCanvas() {
  context = document.getElementById('canvas').getContext('2d');  
}