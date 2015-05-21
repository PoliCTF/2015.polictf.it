function setVisibility(id){
  var elements=document.getElementsByClassName("description");
  for(i = 0; i < elements.length; i++){
    $(elements[i]).hide();
  }
  $("#"+id).fadeIn("slow");
}

function getScores(){
  $.ajax({
    type:"GET",
    url:"http://scoreboard.polictf.local.necst.it/scoreboard/common/status",
    success: function(data, status){
      array_scores = data.scores;
      for(i = 0; i < array_scores.length; i++){
	string = "<ul><li>" + i + "</li><li>" + array_scores[i].name + "</li><li class=\"image-points\">" + array_scores[i].points + "</li><li class=\"image-levels\">" + "1/3" + "</li></ul>"; 
	$("#scores").append(string);
      }
    },
    error: function() { alert('ummh..'); }
  });
}