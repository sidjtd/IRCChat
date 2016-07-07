var net = require('net');
var socket = net.Socket();
var storage = {};

var server = net.createServer( function(socket) {
  var guestName = 'Guest' + Math.floor(Math.random() * 9999999) + 1;
  sendData(' connected. Welcome!', guestName);
  console.log(guestName + ' connected.');
  storage[guestName] = socket;

  socket.write('You have been successfully connected, Welcome!\nTo change your name, use /name (your_desired_name) :)');

  socket.on('end', function () {
    sendData(' disconnected.', guestName);
    console.log(guestName + ' disconnected.');
    delete storage[guestName];
  });

  socket.on('data', function (data) {
    if(data[0] === 47) {
      data = data.toString();
      if(data === '/help\n') {
        socket.write('/name is the only command lol.');
      } else if (data.split(' ')[0] === '/name') {
        data = data.split(' ');
        var check = data[1].replace('\n', '');
        if(data.length !== 2 || data[1].toLowerCase().includes('admin')) {
          socket.write('Invalid Name.');
        } else if(storage[check] !== undefined) {
          socket.write('Name already in use.');
        } else {
          var pastName = guestName;
          guestName = data[1].replace('\n', '');
          storage[guestName] = storage[pastName];
          delete storage[pastName];
          console.log(pastName + ' has changed his name to ' + guestName);
        }
      }
      else {
        socket.write('Type /help for a list of commands.');
      }
    }
    else {
      console.log('[' + guestName + '] ' + data.toString());
      sendData(data, guestName);
    }
  });
});
server.listen(6969);

process.stdout.on('data',function (data) {
  if(data[0] === 47) {
    data = data.toString();
    if(data.split(' ')[0] === '/kick') {
      data = data.split(' ');
      var check = data[1].replace('\n', '');
      if(data.length !== 2 || data[1].toLowerCase().includes('admin')) {
        console.log('Invalid person to kick.');
      } else if (storage[check] === undefined) {
        console.log('User not found.');
      } else {
        // storage[check].close(); kicking needs to happen here
      }
    }
  } else {
    sendData(data, 'ADMIN');
  }
});

function sendData(data, title) {
  for(var prop in storage) {
    storage[prop].write('[' + title + '] ' + data.toString());
  }
}