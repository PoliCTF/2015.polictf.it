function setVisibility(id){
  var elements=document.getElementsByClassName("description");
  for(i = 0; i < elements.length; i++){
    $(elements[i]).hide();
  }
  $("#"+id).fadeIn("slow");
}