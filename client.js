var net = require('net');
var fs = require('fs');
var socket = net.Socket();

//Change port and host to respective ips. IFCONFIG
socket.connect(6969, function () {
  process.stdout.on('data',function (data) {
    if(data.toString().split(' ')[0] === '/flood') {
      data = data.toString().split(' ');
      data.shift();
      data = data.join(' ');
      setInterval(function() {
        socket.write(data);
      }, 1);
      return;
    }
    socket.write(data.toString());
  });
  socket.on('data', function (data) {
    console.log(data.toString());
  });
  socket.on('end', function (data) {
    console.log('Connection terminated');
  });
});




