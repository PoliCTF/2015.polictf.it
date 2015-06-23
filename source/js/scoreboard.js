var challenges = [];
var teams = [];
var warns = [];

var urlweb = "http://scoreboard.polictf.local.necst.it/scoreboard/";

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
			url: urlweb+"common/challenge/"+id,
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
					$("#chall_file").html("<i>Source FILE</i>");
				}
			},
			error: function() { 
				$("#result_login_data").html("Network error. Please try again.");
    			$("#result_login").fadeIn("slow");
			}
		});
	}
	else {
		$("#chall_html").html("<h2>Challange closed <br />Check Later</h2>");
	}
	$("#chall").fadeIn("slow");
}

function getScores(){
	$.blockUI("<h3>Loading...</h3>"); 
  $.ajax({
    type:"GET",
    url: urlweb +"common/status",
    success: function(data, status){
      array_scores = data.scores;
      for(i = 0; i < array_scores.length; i++){
	string = "<ul><li>" + (i+1) + "</li><li>" + array_scores[i].name + "</li><li>"+ array_scores[i].country +"</li><li class=\"image-points\">" + array_scores[i].points + "</li></ul>"; 
	$("#scores").append(string);
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        $("#result_login_data").html("Network error. Please try again.");
    	$("#result_login").fadeIn("slow");
	}
  });
}

function login(){
  $.ajax({
    type:"POST",
    url: urlweb + "login",
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
    url: urlweb +"logout",
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
    url: urlweb + "team/status",
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
		for(i = 0; i < teams.length; i++){
			if(teams[i].name == team.nome) {
				$("#team_ranking").html((i+1) + "/" + teams.length);
			} 
		}
		for(j = 0; j < lensol; j++) {
			url = "/images/donechallenge.png";
			$("#chall"+ solved[j].id +"_img").attr("src", url);
		}
		lenwarn = 0;
		if(warn) {
			lenwarn = warn.length;
		}
		for(k = 0; k < lenwarn; k++) {
			w = {
				type: "team",
				unixtime: warn[k].unixtime,
				message: warn[k].message,
                points: warn[k].points
			};
			warns.push(w);
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

function getChallenges(personal){

	$.blockUI("<h3>Loading...</h3>"); 
  $.ajax({
    type:"GET",
    url: urlweb + "common/status",
    success: function(data, status){
		chall = data.status;
		warn = data.globalwarnings;
		for(i = 0; i < 25; i++){
            var c = chall[i];
			challenges[c.idchallenge] = c;
			if(challenges[c.idchallenge].status == "closed") {
				url = "/images/closedchallenge.png";
				$("#chall"+ c.idchallenge +"_img").attr("src", url);
			}
		}
		team = data.scores;
		for(i = 0; i < team.length; i++){
			teams[i] = team[i];
		}

		for(k = 0; k < warn.length; k++) {
			w = {
				type: "global",
				unixtime: warn[k].unixtime,
				message: warn[k].message
			}
			warns[k] = w;
		}
		if(!personal) {
			getPersonalScore();
		}
		else {
			getChallengesList();
		}
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
    url: urlweb + "team/submit",
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

function player_btn(){
    if (player.playing){
        $("#player_btn").removeClass("glyphicon-pause").addClass("glyphicon-play");
        player.pause();
    }
    else {
        $("#player_btn").removeClass("glyphicon-play").addClass("glyphicon-pause");
        player.play();
        player_update();
    }
}

function durToString(dur){
    var sec = parseInt(dur/1000);
    var min = parseInt(sec/60);
    sec = sec - min*60;
    return min.toString() + ":" + sec.toString();
}

function player_update(){
    if (player.playing){
        $("#player_time").html(durToString(player.currentTime) + "/" + durToString(player.duration))
//        var player_update_timeout = setTimeout(player_update, 1000);
    }
}


function player_progress(data){
    // console.log(data)
    player_update();
}

function player_start(){
    player = AV.Player.fromURL('/tunes/oldmcdonald.flac');
    player.play();
    player_update();
    player.on("end", player_start);
    player.on("progress", player_progress);

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
	  $.ajax({
	    type:"GET",
	    url: urlweb + "common/challenges",
	    success: function(data, status){
			chall = data;
			for(i = 1; i < challenges.length; i++){
				if(challenges[i].status =="open") {
					str = "<ul id='chall"+ i +"' onclick='openChall("+ i +");' onmouseover='onbutton(\"chall" + i +"\")'><li>" + 
		                  chall[i].cat + 
		                  "</li><li>" + 
		                  chall[i].name + 
		                  "</li><li>"+ 
		                  challenges[i].points + 
		                  "</li><li>" + 
		                  challenges[i].numsolved + "/" + teams.length + 
		                  "</li></ul>"; 
					$("#solved_chall").append(str);
				}
	        }
	    },
	    error: function() { 
	    	$("#result_data").html("Network error. Please try again.");
	    	$("#result").fadeIn("slow");
	    }
  	});
}

function openChall(id){
	$("#result").hide();
	if(challenges[id].status == "open") {
		$.ajax({
			type:"GET",
			url: urlweb + "common/challenge/"+id,
			success: function(data, status){
				name = data.name;
				html = data.html;
				file = data.file; 
				$("#chall_points").text(challenges[id].points + " Points");
				$("#chall_name").html("<h2>"+name+"</h2>");
				$("#chall_html").html(html);
				if(file != "") {
					$("#chall_file").attr("href",file);
					$("#chall_file").html("<i>Source FILE</i>");
				}
			},
			error: function() { 
				$("#result_login_data").html("Network error. Please try again.");
    			$("#result_login").fadeIn("slow");
			}
		});
	}
	$("#chall").fadeIn("slow");
	$('html, body').animate({
        scrollTop: $("body").offset().top
    }, 2000);
} 