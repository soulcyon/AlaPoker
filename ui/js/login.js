$(document).ready(function(){
	var ajax_flag = false;

	$("#logindialog input").bind("focus", function(){
		$(this).parent().find("label").hide();
	});
	$("#logindialog input").bind("blur", function(){
		if( $(this).val() != "" ) return;
		$(this).parent().find("label").show();
	});
	$("[rel=opendialog]").click(function(){
		$("#logindialog").modal({
			zIndex: 600
		});
	});
	$("#loginform").submit(function(){
		if( ajax_flag ) return false;

		ajax_flag = true;
		$.post("/auth/raw", $(this).serialize(), function(d){
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
		$.post("/auth/register", $(this).serialize(), function(d){
			ajax_flag = false;
			if( d.error ){
				return alert(d.error);
			} else {
				$("#registerform").html("Thanks for signing up.<br />Password has been sent to your email.");
			}
		});
		return false;
	});
});