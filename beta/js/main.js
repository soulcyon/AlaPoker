$(document).ready(function(){
	for(i = 0;i < 8;i++){
		$("div.card").eq(i%4).delay(i * 250)
		.animate({left: -75+"px", marginTop: 10+"px"},250, function(){i--;$(this).css("z-index", i)})
       .animate({left: 0+"px", marginTop: 0+"px"},250);
	}
});