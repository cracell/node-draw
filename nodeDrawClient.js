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
    socket.on('drawPoints', function(point) { drawSpot(point)});

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

function sendDrawPoints(point) {
  socket.emit('drawPoints', point)
}

function pointsRelativeToObject(e, object) {
  var point = {};
  point.x = e.clientX - object.offset().left + document.documentElement.scrollLeft + document.body.scrollLeft;
  point.y = e.clientY - object.offset().top + document.documentElement.scrollTop + document.body.scrollTop;
  return(point); 
}

$(function() {
  connect();
  
  $('#canvas').bind('mousedown', function(e){
    var point = pointsRelativeToObject(e, $(this));
    drawSpot(point);
    sendDrawPoints(point);
  });
  
  initCanvas();
});

function drawSpot(point) {
   context.fillRect(point.x, point.y, 10, 10);
}

var context;
function initCanvas() {
  context = document.getElementById('canvas').getContext('2d');  
}