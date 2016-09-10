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
//        socket.color = color;
        socket.userNick = username;
        userList[socket.id] = username;
        console.log(userList);
        
        io.emit('userlist', userList);
        io.emit('greeting', username + " just joined the chat!");
        console.log(username  + " joined the chat");
        
        ++numUsers;
        console.log(numUsers + " are in the chat");
    });
    
    //When the server gets the message from the client, 
    //the server resends the message to the client with 
    //the sender name.
    socket.on('sendmsg',function(msg){
        io.emit('chat', userList[socket.id], msg);
        console.log(userList[socket.id] + " says: " + msg);
    });
    
    socket.on('disconnect', function(){
        
        if(numUsers === 0){
            console.log("No one in the chat!");
        }else if(numUsers >= 0){
            
            username = userList[socket.id];
        
            //When the user disconnects, emit bye message to all clients.
            io.emit('bye', username + " just left the chat!");

            //Remove the user from the global list
            delete userList[socket.id];

            //Emit new global list to client
            io.emit('userlist', userList);
            
            console.log(username + ' left the chat room');
            --numUsers;
            console.log(numUsers + " is/are in the chat");
            console.log(userList);
        }else{
            console.log("number cannot be negative")
        }
    });
});