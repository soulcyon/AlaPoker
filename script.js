$(document).ready(function(){
	$("#game").hide();
	$("#init button").click(function(){
		$.post("game.php", {
			players: $(this).val()
		}, function(d){
			$("#init").hide();
			$("#game").show().find(".content").html(d);
		});
	});
});