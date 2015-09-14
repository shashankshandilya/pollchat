  
$(function(){
  var socket = null;

  function createSocket(){
    socket = io();
    //receive chat
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
  }

  // submit username
  $('#submit_username').on('click', function(){
    console.log( $('#userid').val() );
    $('.username').addClass('hide');
    $('.chatWindow').removeClass('hide');
  });

  // submit chat
  $('#submit_chat').on('click', function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
});

