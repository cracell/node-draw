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

connect();

$(function() {
  $('#canvas').click(function(e){
    
  });
});

var context;
function initCanvas() {
  var context = $('#canvas').getContext('2d');  
}