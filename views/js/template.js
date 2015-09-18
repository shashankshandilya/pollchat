var socket = null;
var users  = {}
$(function(){
  
  var username = null;

  function populateListsActiveUsers(){
    lists = '';
    $.each(users, function(k,v){
      if( v != username ){
        lists = lists + '<li class="user-list" data-id='+k+'>'+ v +'</li>';
      }
    });
    $("#user_lists").html( lists );
  }

  function createSocket(){
    socket = io();
    //receive chat
    socket.on('chat message', function(msg){
      console.log("msg is" + msg);
      msg = JSON.parse( msg );
      sender = msg['sender'];
      text   = msg['msg'];
      $('#messages').append($('<li>').text( sender +' says ' + text ) );
    });
    $('.userDetails').html("<h1> Welcome <u>"+ username +"</u></h1>")
    //user connected
    socket.on('user', function(msg){
      msg = JSON.parse(msg);
      users = msg;
      populateListsActiveUsers();
    });

    //user disconnected
    socket.on('disconnect', function(msg){
      msg = JSON.parse(msg);
      users = msg;
      populateListsActiveUsers();
    });

    data = { username : username }
    console.log("emit user event");
    socket.emit('user', data );
  }

  //user list click
  $('body').on('click', '.user-list', function(){
    $('li').removeClass('selected');
    $( this ).addClass('selected');
  });

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

    if ( undefined != $('li.selected').attr('data-id') ){
      recId = $('li.selected').text();
    }else{
      $.each(users, function(k,v){
        if( v != username ){
          recId  = v
        }
      });
    }
    $.each(users, function(k,v){
      if( v == username ){
        userId = k;
        return;
      }
    });
    data = { sender : username, msg: msg, receiver : recId }
    console.log("send chat data");
    console.log(data);
    socket.emit('chat message', JSON.stringify( data ) );
    $('#inputmessage').val('');
    return false;
  });
});

