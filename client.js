var net = require('net');
var fs = require('fs');
var socket = net.Socket();

socket.connect(6969, function () {
  process.stdout.on('data',function (data) {
    socket.write(data.toString());
  });
  socket.on('data', function (data) {
    console.log(data.toString());
  });
  socket.on('end', function (data) {
    console.log('Connection ended');
    socket.end();
  });
});




