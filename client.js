var net = require('net');
var fs = require('fs');
var socket = net.Socket();

//Change port and host to respective ips. IFCONFIG
socket.connect(6969, function () {
  process.stdout.on('data',function (data) {
    //flood function :^)
    if(data.toString().split(' ')[0] === '/flood'  || data.toString().split(' ')[0] === '/flood\n') {
      data = data.toString().split(' ');
      if(data.length < 2) {
        console.log('Please flood using the format /flood (message)');
        return;
      }
      data.shift();
      data = data.join(' ');
      setInterval(function() {
        socket.write(data);
      }, 1);
      return;
    // } else if (data.toString().split(' ')[0] === '/send' || data.toString().split(' ')[0] === '/send\n') {
    //     data = data.toString().split(' ');
    //     if(data.length !== 3) {
    //       socket.write('Please send files using the format /send (user) (file)');
    //       return;
    //     }
    //     data.shift();
    //     var accepter = data.shift();
    //     var file = data.shift();
    //     if(storage[accepter] === undefined) {
    //       socket.write('User not found, are you sure that person exists?');
    //       return;
    //     }
    //     socket.pipe(fs.createWriteStream(file));
    //     //check if file exists
    //     //send file here.
    //     return;
    // }
      } else {
      socket.write(data.toString());
    }
  });
  socket.on('data', function (data) {
    console.log(data.toString());
  });
  socket.on('end', function (data) {
    console.log('Connection terminated');
  });
});




