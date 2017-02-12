



// Shorthand for $( document ).ready()
$(function() {
  console.log( "ready!" );


  $( "#BTN_MENU" ).on( "click", function() {
    $('.ui.labeled.icon.sidebar').sidebar('toggle');
  });


  $( "#BTN_NODE" ).on( "click", function() {
    // You can also require other files to run in this process
    require('./snconnect-client.js')


  });

});
