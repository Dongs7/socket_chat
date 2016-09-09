var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io =  require('socket.io')(server);

var username;
var userList = {};
var numUsers = 0;

server.listen(3000, function(){
  console.log('App is listening on port 3000...');
});

app.use(express.static(__dirname + '/views'));

io.on('connection', function(socket){
    
    
    socket.on('add user', function(username){
        
        socket.userNick = username;
        userList[socket.id] = username;
        console.log(userList);
        io.emit('userlist', userList);
        io.emit('greeting', username + " just joined the chat!");
        console.log(username + " joined the chat");
        ++numUsers;
        console.log(numUsers + " are in the chat");
    });
    
    
    socket.on('sendmsg',function(msg){
        io.emit('chat', userList[socket.id], msg);
        console.log(userList[socket.id] + " says: " + msg);
    });
    
    
    
    
    
    
    
    socket.on('disconnect', function(){
        username = userList[socket.id];
        delete userList[socket.id];
        io.emit('userlist', userList);
        console.log(username + ' left the chat room');
        
        
        --numUsers;
        if(numUsers === 0){
            console.log("No one in the chat!");
        }else{
            console.log(numUsers + " is/are in the chat");
        }
    });
});