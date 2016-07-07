var net = require('net');
var socket = net.Socket();
var storage = {};
//Need to create package.json with dependencies.

/**
 * Creates a server instance using the net module to be hosted using node. Each socket is in its own scope from different clients.
 */
var server = net.createServer( function(socket) {
  var guestName = 'Guest' + Math.floor(Math.random() * 9999999) + 1;
  sendData(' connected. Say Hello!', guestName);
  console.log(guestName + ' connected.');
  storage[guestName] = socket;

  socket.write('You have been successfully connected, Welcome!\nTo change your name, use /name (your_desired_name) :)');

  //On socket end this is triggered
  socket.on('end', function () {
    sendData(' disconnected.', guestName);
    console.log(guestName + ' disconnected.');
    delete storage[guestName];
  });

  //Whenever they send data, this is triggered
  socket.on('data', function (data) {
    if(data[0] === 47) {
      data = data.toString();
      if(data === '/help\n') {
        socket.write('/name, /list, /status');
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
          console.log(pastName + ' has changed his/her name to ' + guestName);
        }
      } else if (data === '/list\n') {
          var userString = '';
          for(var prop in storage) {
            userString = userString + prop + '\n';
          }
          socket.write(userString);
        } else if (data === '/status\n') {
          var size = 0;
          for(var key in storage) {
            size++;
          }
          socket.write('There are currently ' + size + ' users online.');
        } else {
        socket.write('Type /help for a list of commands.');
      }
    }
    else {
      console.log('[' + guestName + '] ' + data.toString());
      sendData(data, guestName);
    }
  });
});
//The port the server is listening on.
server.listen(6969);

//Whenever the server passes out data, this is triggered.
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
        storage[check].destroy();
        delete storage[check];
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