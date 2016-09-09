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
        }   
        socket.emit('add user', userNick);
    }
    
    
    function cleanInput (input) {
        return $('<div/>').text(input).text();
    }
    
    socket.on('greeting', function(msg){
        $('.chatArea').append("<li>" +  msg + " " + "</li>");
    })
    

    socket.on('chat', function(sender,msg){
        $('.chatArea').append("<li>" + sender + ": " + msg + " " + "</li>");
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
    
    $chatEnter.keydown(function(e){
       if(e.which === 13){
           var msg = $chatEnter.val();
           alert(msg);
           if (msg != null){
               socket.emit('sendmsg', msg);
           $chatEnter.val("");}
           else{
               return;
           }
       } 
    });
}); 