$(document).ready(function(){
	$("button").click(function(){
		$.post("game.php", {
			players: $(this).val()
		}, function(d){
			$("#init").hide();
			$("#game").show().html(d);
		});
	});
});