var express = require('express');
var app =  express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//app.use( '/front_end',express.static('site'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var clients = {};
var socketsOfClients = {};

io.on('connection', function (socket) {
    socket.on('set username', function (userName) {
        // Is this an existing user name?
        if (clients[userName] === undefined) {
            console.log('connected',userName + ': ' + socket.id);
            clients[userName] = socket.id;
            socketsOfClients[socket.id] = userName;
        } else if (clients[userName] === socket.id) {
                // Ignore for now
        } else {
            //userNameAlreadyInUse(socket.id, userName);
        }
    });
    socket.on('disconnect', function () {
        var uName = socketsOfClients[socket.id];
        delete socketsOfClients[socket.id];
        delete clients[uName];
    })

    socket.on('chat', function (data) {
        socket.broadcast.emit('chat', data);
    });
    socket.on('notification', function (data) {
        console.log('notification', data)
        io.to(clients[data.userName]).emit('notification', data);
    });

    socket.on('print', function (data) {
        //do some printingio.emit('chat message', msg);
    });

    socket.on('override', function (data) {
        //do some printingio.emit('chat message', msg);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
