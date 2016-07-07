var net = require('net');
var fs = require('fs');
var socket = net.Socket();

//Change port and host to respective ips. IFCONFIG
socket.connect(6969, function () {
  process.stdout.on('data',function (data) {
    socket.write(data.toString());
  });
  socket.on('data', function (data) {
    console.log(data.toString());
  });
  socket.on('end', function (data) {
    console.log('Connection ended');
  });
});




