var challenges = [];
var teams = [];

function displayList(id){
	reset_chall();
	var elements=document.getElementsByClassName("challList");
	for(i = 0; i < elements.length; i++){
		$(elements[i]).hide();
	}
	
	var elements=document.getElementsByClassName("description");
	for(i = 0; i < elements.length; i++){
		$(elements[i]).hide();
	}

	if(document.getElementById(id).style.visibility == "visible") {
		document.getElementById(id).style.display = "none";
		document.getElementById(id).style.visibility = "hidden";
	}
	else {
		document.getElementById(id).style.display = "block";
		document.getElementById(id).style.visibility = "visible";
	}
}


function loadChallange(id){
	var elements=document.getElementsByClassName("description");
	for(i = 0; i < elements.length; i++){
		$(elements[i]).hide();
	}
	reset_chall();
	if($("#chall"+ id +"_img").attr("src").split("_")[0].split(".")[0].indexOf("yellowbrick") < 0) {
		url = $("#chall"+ id +"_img").attr("src").split("_")[0].split(".")[0] + "_clicked.jpg";
		$("#chall"+ id +"_img").attr("src", url);
	}
	if(challenges[id].status == "open") {
		$.ajax({
			type:"GET",
			url:"http://scoreboard.polictf.local.necst.it/scoreboard/common/challenge/"+id,
			success: function(data, status){
				name = data.name;
				html = data.html;
				file = data.file; 
				$("#chall_name").html("<h2>"+name+"</h2>");
				$("#chall_html").html(html);
				$("#chall_points").text(challenges[id].points + " Points");
				if(file != "") {
					$("#chall_file").attr("href",file);
					$("#chall_file").html("Source");
				}
			},
			error: function() { alert('ummh..'); }
		});
	}
	else {
		$("#chall_html").html("<h2>Challange closed <br />Check Later</h2>");
	}
	$("#chall").fadeIn("slow");
}

function getScores(){
  $.ajax({
    type:"GET",
    url:"http://scoreboard.polictf.local.necst.it/scoreboard/common/status",
    success: function(data, status){
      array_scores = data.scores;
      for(i = 0; i < array_scores.length; i++){
	string = "<ul><li>" + (i+1) + "</li><li>" + array_scores[i].name + "</li><li class=\"image-points\">" + array_scores[i].points + "</li><li class=\"image-levels\">" + "1/3" + "</li></ul>"; 
	$("#scores").append(string);
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
	}
  });
}

function loginTEST(){
  $.ajax({
    type:"POST",
    url:"http://scoreboard.polictf.local.necst.it/scoreboard/login",
	data: { teamname: "dummy", 
			password: "foobar"
	},
    xhrFields: {
       withCredentials: true
    },
    crossDomain: true,
    success: function(data, status){
		log = data.r;
		if(log == "1") {
			window.location.replace("/scoreboard/level2.html");
		}
    },
    error: function (xhr, textStatus, thrownError) {
    	alert(textStatus);
    	console.log(xhr);
    }
  });
}

function logout(){
  $.ajax({
    type:"GET",
    url:"http://scoreboard.polictf.local.necst.it/scoreboard/logout",
    success: function(data, status){
		log = data.r;
		if(log == "1") {
			window.location.replace("/scoreboard/login.html");
		}
    },
    error: function (xhr, textStatus, thrownError) {
        alert(textStatus);
    },
    xhrFields: {
       withCredentials: true
   	}
  });
}

function getPersonalScore(){
  $.ajax({
    type:"GET",	
    xhrFields: {
       withCredentials: true
    },
    url:"http://scoreboard.polictf.local.necst.it/scoreboard/team/status",
    success: function(data, status){
    	if (data.status == "Plz login.") {
    		window.location.replace("/scoreboard/login.html");
    	}
		team = data.statosquadra;
		solved = data.solved;
		$("#team_name").html(team.nome);
		$("#team_points").html(team.totpoints);
		$("#team_solved").html(solved.length + "/" + challenges.length);
		for(i = 1; i < teams.length; i++){
			if(teams[i].name == team.nome) {
				$("#team_ranking").html(i + "/" + teams.length);
			} 
		}
		for(j = 0; j < solved.length; j++) {
			url = "/images/yellowbrick.jpg";
			$("#chall"+ solved[j].id +"_img").attr("src", url);
		}
    },
    error: function (xhr, textStatus, thrownError) {
        alert(textStatus);
 	}
	});
}

function getChallenges(){
  $.ajax({
    type:"GET",
    url:"http://scoreboard.polictf.local.necst.it/scoreboard/common/status",
    success: function(data, status){
		chall = data.status;
		for(i = 1; i <= 27; i++){
			challenges[i] = chall[i-1];
		}
		team = data.scores;
		for(i = 1; i <= team.length; i++){
			teams[i] = team[i-1];
		}
		getPersonalScore();
    },
    error: function() { alert('ummh..'); }
  });
}

function reset_chall() {
	for(i = 1; i < challenges.length; i++) {
		$("#chall"+ i +"_img").attr("src", $("#chall"+ i +"_img").attr("src").split("_")[0].split(".")[0] + ".jpg");
	}
	$("#chall_name").html("");
	$("#chall_html").html("");
	$("#chall_points").text("");
	$("#chall_file").removeAttr("href");
	$("#chall_file").html("");
}

function close_chall() {
	var elements=document.getElementsByClassName("challList");
	for(i = 0; i < elements.length; i++){
		$(elements[i]).hide();
	}
	
	var elements=document.getElementsByClassName("description");
	for(i = 0; i < elements.length; i++){
		$(elements[i]).hide();
	}	
}

function submit_flag() {
	$.ajax({
    type:"POST",
    url:"http://scoreboard.polictf.local.necst.it/scoreboard/team/submit",
    data: { flag: $("#flag").val() },
    xhrFields: {
       withCredentials: true
    },
    crossDomain: true,
    success: function(data, status){
		res = data.result;
		flag = data.flag;
		if( res > 0 ){
			alert("Challenge solved! Points gained: " + res);
		}
		else if (res == "wrong") {
			alert("Wrong flag... Try again!! Flag: " + flag);
		}
		else if (res == "alreadysolved") {
			alert("Challange already solved. Flag:" + flag);
		}
		else if (res == "rightbutcannotsave") {
			alert("Flag correct but some errors occur. Try again. Flag:" + flag);
		}
		getPersonalScore();
		$("#flag").val("");
    },
    error: function() { alert('ummh..'); }
  });
}
