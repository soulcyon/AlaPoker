$(function(){
var i = 0;
console.log($("div.card").eq(3).delay)
for(c = 0; c < 8; c++)
	$("div.card").eq(c%4).delay(c*250)
	.animate({left: 15+"%", marginTop: 2+"em"},250, "easeOutBack",function(){i--;$(this).css("z-index", i)})
	.animate({left: 38+"%", marginTop: 0+"em"},250, "easeOutBack");
});

