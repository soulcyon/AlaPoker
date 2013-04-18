$(document).ready(function(){
	$("#game").hide();
	var hands = "";
	var board = "";
	$("#init button").click(function(){
		$.post("game.php", {
			players: $(this).val()
		}, function(d){
			$("#init").hide();
			$("#game").show().find(".content").html(d);
		});
	});
	function getProbs(d){
		$("button").removeAttr("disabled");
		for(i = 0; i < d.wins.length; i++){
			if( $(".hand").eq(i).find(".prob").length == 0 ){
				$(".hand").append($("<div />").addClass("prob"));
			}
			$(".hand").eq(i).find(".prob").html(
				"Win: " + ((Math.floor(d.wins[i]/d.total * 10000)/100) + "%<br />") +
				"Tie: " + ((Math.floor(d.ties[i]/d.total * 10000)/100) + "%")
			);
		}
	}
	$(document).delegate("#pre", "click", function(){
		hands = board = "";
		$(".hand img").each(function(i,e){
			hands += ($("#flag").is(":checked") && !(i % 2) ? "," : " ") + $(this).attr("alt");
		});
		$(".content > img:not(.burn)").each(function(i, e){
			board += " " + $(this).attr("alt");
		});
		$("button").attr("disabled", true);
		$.post("game.php", {
			c: $("#flag").is(":checked"),
			h: hands.substring(1),
			b: "",
			d: "",
			calc: true
		}, getProbs);
	});
	$(document).delegate("#flop", "click", function(){
		hands = board = dead = "";
		$(".hand img").each(function(i,e){
			hands += ($("#flag").is(":checked") && !(i % 2) ? "," : " ") + $(this).attr("alt");
		});
		$(".content > img:not(.burn)").each(function(i, e){
			board += " " + $(this).attr("alt");
		});
		$(".panel .back img").each(function(i, e){
			dead += " " + $(this).attr("alt");
		});
		$("button").attr("disabled", true);
		$.post("game.php", {
			c: $("#flag").is(":checked"),
			h: hands.substring(1),
			b: board.substring(1, 9),
			d: dead.substring(1, 3),
			calc: true
		}, getProbs);
	});
	$(document).delegate("#turn", "click", function(){
		hands = board = dead = "";
		$(".hand img").each(function(i,e){
			hands += ($("#flag").is(":checked") && !(i % 2) ? "," : " ") + $(this).attr("alt");
		});
		$(".content > img:not(.burn)").each(function(i, e){
			board += " " + $(this).attr("alt");
		});
		$(".panel .back img").each(function(i, e){
			dead += " " + $(this).attr("alt");
		});
		$("button").attr("disabled", true);
		$.post("game.php", {
			c: $("#flag").is(":checked"),
			h: hands.substring(1),
			b: board.substring(1, 12),
			d: dead.substring(1, 6),
			calc: true
		}, getProbs);
	});
	$(document).delegate("#river", "click", function(){
		hands = board = dead = "";
		$(".hand img").each(function(i,e){
			hands += " " + $(this).attr("alt");
		});
		$(".content > img:not(.burn)").each(function(i, e){
			board += " " + $(this).attr("alt");
		});
		$(".panel .back img").each(function(i, e){
			dead += " " + $(this).attr("alt");
		});
		$("button").attr("disabled", true);
		$.post("game.php", {
			c: $("#flag").is(":checked"),
			h: hands.substring(1),
			b: board.substring(1),
			d: dead.substring(1),
			r: "true",
			calc: true
		}, getProbs);
	});
});