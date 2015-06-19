var challenges = [];
var teams = [];
var warns = [];

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
	$("#result").hide();
}


function loadChallange(id){
	var elements=document.getElementsByClassName("description");
	for(i = 0; i < elements.length; i++){
		$(elements[i]).hide();
	}
	reset_chall();
	$("#result").hide();
	if($("#chall"+ id +"_img").attr("src").split("_")[0].split(".")[0].indexOf("donechallenge") < 0 && $("#chall"+ id +"_img").attr("src").split("_")[0].split(".")[0].indexOf("closedchallenge") < 0) {
		url = $("#chall"+ id +"_img").attr("src").split("_")[0].split(".")[0] + "_clicked.png";
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
				if($("#chall"+ id +"_img").attr("src").split("_")[0].split(".")[0].indexOf("donechallenge") < 0) {
					$("#chall_points").text(challenges[id].points + " Points");
				}
				else {
					$("#chall_points").text(challenges[id].points + " Points - SOLVED");
				}
				$("#chall_name").html("<h2>"+name+"</h2>");
				$("#chall_html").html(html);
				if(file != "") {
					$("#chall_file").attr("href",file);
					$("#chall_file").html("Source FILE");
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
	string = "<ul><li>" + (i+1) + "</li><li>" + array_scores[i].name + "</li><li class=\"bfh-countries\" data-country=\"US\" data-flags=\"true\" /></li><li class=\"image-points\">" + array_scores[i].points + "</li></ul>"; 
	$("#scores").append(string);
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
	}
  });
}

function login(){
  $.ajax({
    type:"POST",
    url:"http://scoreboard.polictf.local.necst.it/scoreboard/login",
	data: { teamname: $("#username").val(), 
			password: $("#password").val()
	},
    xhrFields: {
       withCredentials: true
    },
    crossDomain: true,
    success: function(data, status){
		log = data.r;
		if(log == "1") {
			$("#result_login_data").html("Login done!");
			$("#result_login").fadeIn("slow");
			window.location.replace("/scoreboard/level2.html");
		}
		if(log == "0") {
			$("#result_login_data").html("Login error <br />Please check login data");
			$("#result_login").fadeIn("slow");
		}
    },
    error: function (xhr, textStatus, thrownError) {
    	$("#result_login_data").html("Network error. Please try again.");
    	$("#result_login").fadeIn("slow");
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
    	$("#chall").hide();
    	close_chall();
		team = data.statosquadra;
		warn = data.teamwarnings;
		lensol = 0;
		if(data.solved) {
			solved = data.solved;
			lensol = solved.length;
		}

		$("#team_name").html(team.nome);
		$("#team_points").html(team.totpoints);
		$("#team_solved").html(lensol + "/" + challenges.length);
		for(i = 1; i < teams.length; i++){
			if(teams[i].name == team.nome) {
				$("#team_ranking").html(i + "/" + teams.length);
			} 
		}
		for(j = 0; j < lensol; j++) {
			url = "/images/donechallenge.png";
			$("#chall"+ solved[j].id +"_img").attr("src", url);
		}
		lenwarn = 0;
		if(data.warn) {
			lenwarn = warn.length;
		}
		len = warns.length
		for(k = warns.length; k < (lenwarn+len); k++) {
			w = {
				type: "team",
				unixtime: warn[k-warns.length].unixtime,
				message: warn[k-warns.length].message
			};
			warns[k] = w;
		}

		warns.sort(compare_unixtime);
		$("#hints_list").html("");
		for(l = 0; l < warns.length; l++) {
			date = new Date(warns[l].unixtime * 1000),
			datevalue = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() +" [" + date.getHours() + ":" + date.getMinutes() + "] ";
			$("#hints_list").append("<li class=\"" + warns[l].type + "\"> [ " + warns[l].type + " ] " + datevalue + " - " + warns[l].message + "</li>")
		}
    },
    error: function (xhr, textStatus, thrownError) {
        $("#result_data").html("Network error. Please try again.");
    	$("#result").fadeIn("slow");
 	}
	});
}

function getChallenges(){

	$.blockUI("<h3>Loading...</h3>"); 
  $.ajax({
    type:"GET",
    url:"http://scoreboard.polictf.local.necst.it/scoreboard/common/status",
    success: function(data, status){
		chall = data.status;
		warn = data.globalwarnings;
		for(i = 1; i <= 25; i++){
			challenges[i] = chall[i-1];
			if(challenges[i].status == "closed") {
				url = "/images/closedchallenge.png";
				$("#chall"+ challenges[i].idchallenge +"_img").attr("src", url);
			}
		}
		team = data.scores;
		for(i = 1; i <= team.length; i++){
			teams[i] = team[i-1];
		}

		for(k = 0; k < warn.length; k++) {
			w = {
				type: "global",
				unixtime: warn[k].unixtime,
				message: warn[k].message
			}
			warns[k] = w;
		}

		getPersonalScore();
    },
    error: function() { 
    	$("#result_data").html("Network error. Please try again.");
    	$("#result").fadeIn("slow");
    }
  });
}

function reset_chall() {
	for(i = 1; i < challenges.length; i++) {
		$("#chall"+ i +"_img").attr("src", $("#chall"+ i +"_img").attr("src").split("_")[0].split(".")[0] + ".png");
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
	$("#chall").hide();
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
		id = data.id;
		if( res > 0 ){
			$("#result_data").html("<h2>Challenge " + id + " solved! <br />Points gained: " + res + "</h2>");
		}
		else if (res == "wrong") {
			$("#result_data").html("<h2>Wrong flag... Try again!! <br />Flag: " + flag + "</h2>");
		}
		else if (res == "alreadysolved") {
			$("#result_data").html("<h2>Challenge " + id +" already solved<br /> Flag:" + flag + "</h2>");
		}
		else if (res == "rightbutcannotsave") {
			$("#result_data").html("<h2>Flag correct but some errors occur. Try again. <br /> Flag:" + flag + "</h2>");
		}
		else if (res == "slowdown") {
			$("#result_data").html("<h2>Too fast!!! Please wait 2 seconds to submit again the flag.</h2>");
		}
		getPersonalScore();
		$("#result").fadeIn("slow");
		$("#flag").val("");
    },
    error: function() { 
    	$("#result_data").html("Network error. Please try again.");
    	$("#result").fadeIn("slow");
    }
  });
}

$(function() {
    $("#submit_flag_form input").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            submit_flag();
            return false;
        } else {
            return true;
        }
    });
});

$(function() {
    $("#login_form input").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        	login();
            return false;
        } else {
            return true;
        }
    });
});


function compare_unixtime(a,b) {
  if (a.unixtime < b.unixtime)
    return -1;
  if (a.unixtime > b.unixtime)
    return 1;
  return 0;
}



function getChallengesList(){

	$.blockUI("<h3>Loading...</h3>"); 
  $.ajax({
    type:"GET",
    url:"http://scoreboard.polictf.local.necst.it/scoreboard/common/status",
    success: function(data, status){
		chall = data.status;
		for(i = 1; i <= 25; i++){
			string = "<ul><li>" + "-"+ "</li><li>" + chall[i].name + "</li><li>"+ chall[i].points "</li><li>" + chall[i].numsolved + "</ul>"; 
			$("#solved_chall").append(string);
    },
    error: function() { 
    	$("#result_data").html("Network error. Please try again.");
    	$("#result").fadeIn("slow");
    }
  });
}