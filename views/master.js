$(document).ready(function(){
    var socket = io();
    
    //var $window = $(window);
    var $nickPage = $('.nickPage');
    var $chatPage = $('.chatPage');
    
    var $nickEnter = $('.nickEnter');
    var $chatEnter = $('.chatEnter');
    
    var userNick;
    var userList = [];
    
    
    function setNickname(){
        userNick = cleanInput($nickEnter.val().trim());
        
        if(userNick){
            $nickPage.fadeOut();
            $chatPage.fadeIn();
            $chatEnter.focus();
        }
        socket.emit('add user', userNick);
    }
    
    
    function cleanInput (input) {
        return $('<div/>').text(input).text();
    }
    
    //Broadcast Greeting message when new users are connected.
    // Greeting message aligns in the center.
    socket.on('greeting', function(msg){
        $('.chatArea').append("<li class='greet'>" +  msg + " " + "</li>");
    });
    
    socket.on('bye', function(msg){
        $('.chatArea').append("<li class='bye'>" +  msg + " " + "</li>");
    });
    

    socket.on('chat', function(sender,msg){
        $('.chatArea').append("<li>" +  sender +  ": " + msg + " " + "</li>");
    });
    
    
    
    //When users connect to/ disconnect from the chat, update list
    //of users.
    socket.on('userlist', function(userList){

        $('.users').empty();
        $.each(userList, function(socketid,userNick){
            $('.users').append("<li>" + userNick + "</li>");
        });
    });
       
    
    
    $nickEnter.keydown(function(e){
       if (e.which === 13){
           setNickname();
       } 
    });
    
    
    //When the user hits the enter after typing the message,
    //send message to server.
    $chatEnter.keydown(function(e){
       if(e.which === 13){
           var msg = $chatEnter.val();
           //alert(msg);
           if (msg !== ""){
               socket.emit('sendmsg', msg);
           $chatEnter.val("");}
           else{
               alert("string empty");
           }
       } 
    });
}); 