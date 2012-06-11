var socket;
var firstconnect = true,
    circleSize = 20,
    catMeow;

function connect() {
  loadSounds();
  if (firstconnect) {
    socket = io.connect(null);

    socket.on('message', function(data) { message(data); });
    socket.on('connect', function() { status_update("Connected to Server"); });
    socket.on('disconnect', function() { status_update("Disconnected from Server"); });
    socket.on('reconnect', function(){ status_update("Reconnected to Server"); });
    socket.on('reconnecting', function( nextRetry ){ status_update("Reconnecting in " + nextRetry + " seconds"); });
    socket.on('reconnect_failed', function() { message("Reconnect Failed"); });
    socket.on('drawPoints', function(point) { drawPoint(point)});
    socket.on('colorChange', function(color) { updateColor(color)});
    socket.on('sizeChange', function(size) { updateSize(size)});
    socket.on('playMeow', function() { catMeow.play()});

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

function sendDrawPoints(point) {
  socket.emit('drawPoints', point)
}

function updatePoint(daPoint) {
  newPoint = true;
  point = daPoint; 
}

function updateColor(color) {
  context.fillStyle = color;  
}

function colorChange(color) {
  updateColor(color);
  socket.emit('colorChange', color);
}

function sizeChange(size) {
  updateSize(size);
  socket.emit('sizeChange', size);
}

function updateSize(size) {
  if (parseInt(size) > 0) {
    circleSize = size;  
  }
}

//Was using update point but causes the client to echo back the point it draws...hmm.
function drawPoint(daPoint) {
  clearCanvas(context);
  drawCircle(daPoint, context);
}

function pointsRelativeToObject(e, object) {
  var point = {};
  point.x = e.clientX - object.offset().left + document.documentElement.scrollLeft + document.body.scrollLeft;
  point.y = e.clientY - object.offset().top + document.documentElement.scrollTop + document.body.scrollTop;
  return(point); 
}

function drawCircle(point, context) {
  context.beginPath();
  context.arc(point.x, point.y, circleSize, 0, Math.PI*2, true);
  context.closePath();
  context.fill();
}

function clearCanvas(context) {
  context.clearRect(0, 0, 1000, 700);
}

var renderTimer = null,
    newPoint = false,
    point = {x: null, y: null},
    context;

$(function() {
  renderTimer = setInterval(render, (20 / 1000));
  connect();
  
  initCanvas();
});

function render() {
  if (newPoint) {
    drawPoint(point);
    sendDrawPoints(point);
    newPoint = false;
  }  
}

//Setup mousemove to rerender on polling intervals so it doesn't fire too much like a dick fuck.

function drawSpot(point) {
   context.fillRect(point.x, point.y, 10, 10);
}

function initCanvas() {
  context = document.getElementById('canvas').getContext('2d');  
}

function loadSounds() {
  catMeow = document.createElement('audio');
  catMeow.src = '/sounds/meow11.wav';
}

function broadcastPlayMeow() {
  socket.emit('playMeow');  
}