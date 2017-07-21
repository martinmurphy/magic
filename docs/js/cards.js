$(document).ready(function(){

  var source   = $("#cardlist-template").html();
  var template = Handlebars.compile(source);

  var html    = template({cards:cards});
  $('#cardlist').html(html);

  $("#all").click(function(){
    var html    = template({cards:cards});
    $('#cardlist').html(html);
  });

  $("#owned").click(function(){
    var html    = template({cards:_.filter(cards,function(card){return card.count>0})});
    $('#cardlist').html(html);
  });

  $("#wanted").click(function(){
    var html    = template({cards:_.filter(cards,function(card){return card.count<=0})});
    $('#cardlist').html(html);
  });
});
