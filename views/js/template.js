var socket = null;
var users  = {}
$(function(){
  
  var username = null;

  function createSocket(){
    socket = io();
    //receive chat
    socket.on('chat message', function(msg){
      msg = JSON.parse( msg );
      sender = users[ msg['sender'] ];
      text   = msg['msg'];
      $('#messages').append($('<li>').text( sender +' says ' + text ) );
    });

    //user connected
    socket.on('user', function(msg){
      msg = JSON.parse(msg);
      users = msg;
    });

    //user disconnected
    socket.on('disconnect', function(msg){
      msg = JSON.parse(msg);
      users = msg;
    });

    data = { username : username }
    socket.emit('user', data );
  }

  // submit username
  $('#submit_username').on('click', function(){
    username = $.trim( $('#userid').val() );
    $('.wrapper').addClass('hide');
    $('.chatWindow').removeClass('hide');
    createSocket();
  });

  // submit chat
  $('#submit_chat').on('click', function(){
    userId = null;
    recId  = null;
    msg  = $.trim( $('#inputmessage').val() );
    $.each(users, function(k,v){
      if( v != username ){
        recId  = k
      }else{
        userId = k
      }
    });
    data = { sender : userId, msg: msg, receiver : recId }
    console.log("send chat data");
    console.log(data);
    socket.emit('chat message', JSON.stringify( data ) );
    $('#inputmessage').val('');
    return false;
  });

});

