$(document).ready(function(){
	var ajax_flag = false;

	$("#logindialog input").bind("focus", function(){
		$(this).parent().find("label").hide();
	});
	$("#logindialog input").bind("blur", function(){
		if( $(this).val() != "" ) return;
		$(this).parent().find("label").show();
	});
	$("#facebook").click(function(){
		$.post("/login/facebook", {}, function(url){
			window.location.href = url;
		});
		return false;
	});
	$("#persona").click(function(){
		navigator.id.request();
	});
	$("#opendialog").click(function(){
		$("#logindialog").modal({
			zIndex: 600
		});
	});
	$("#loginform").submit(function(){
		if( ajax_flag ) return false;

		ajax_flag = true;
		$.post("/login/rawAuth", $(this).serialize(), function(d){
			ajax_flag = false;
			if( d.length == 0 ){
				return alert("Invalid Username or Password");
			} else {
				window.location.reload();
			}
		});
		return false;
	});
	$("#registerform").submit(function(){
		if( ajax_flag ) return false;

		ajax_flag = true;
		$.post("/login/register", $(this).serialize(), function(d){
			ajax_flag = false;
			if( d.error ){
				return alert(d.error);
			} else {
				$("#registerform").html("Thanks for signing up.<br />Password has been sent to your email.");
			}
		});
		return false;
	});
	navigator.id.watch({
	    onlogin: function(assertion) {
	        $.post('/login/persona', {
	            assertion: assertion,
	            cacheBust: new Date()
	        }, function(msg){
	            window.location.href = "http://beta.alapoker.net/";
	        });
	    },
	    onlogout: function(){

	    }
	});
});