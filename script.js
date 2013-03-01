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
			$(".hand img").each(function(i,e){
				hands += " " + $(this).attr("alt");
			});
			$(".content > img:not(.burn)").each(function(i, e){
				board += " " + $(this).attr("alt");
			});
		});
	});
	function getProbs(d){
		$("button").removeAttr("disabled");
		for(i = 0; i < d.length; i++){
			if( $(".hand").eq(i).find(".prob").length == 0 ){
				$(".hand").append($("<div />").addClass("prob"));
			}
			$(".hand").eq(i).find(".prob").html((Math.floor(d[i] * 10000)/100) + "%");
		}
	}
	$(document).delegate("#pre", "click", function(){
		$("button").attr("disabled", true);
		$.post("game.php", {
			h: hands.substring(1),
			b: "",
			d: "",
			calc: true
		}, getProbs);
	});
	$(document).delegate("#flop", "click", function(){
		$("button").attr("disabled", true);
		$.post("game.php", {
			h: hands.substring(1),
			b: board.substring(1, 9),
			d: $("#dead").val().substring(0, 2),
			calc: true
		}, getProbs);
	});
	$(document).delegate("#turn", "click", function(){
		$("button").attr("disabled", true);
		$.post("game.php", {
			h: hands.substring(1),
			b: board.substring(1, 12),
			d: $("#dead").val().substring(0, 5),
			calc: true
		}, getProbs);
	});
	$(document).delegate("#river", "click", function(){
		$("button").attr("disabled", true);
		$.post("game.php", {
			h: hands.substring(1),
			b: board.substring(1),
			d: $("#dead").val(),
			calc: true
		}, getProbs);
	});
});