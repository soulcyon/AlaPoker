// Refresh page in 30 minutes
setTimeout(function(){
	alert("Your session has timed out");
	window.location.reload();
}, 1801000);

// Get rid of annoying facebook hash
if (window.location.hash == '#_=_') window.location.href = '/';

$(document).ready(function(){
	var AJAX_SCRIPT = "/aef1a53c65791117bf612fd6e39a3632f9f063ae4b2b25ee26712711d5956875";

	$.post(AJAX_SCRIPT,{
		type: "getopts"
	}, function(d){
		console.log(d);
		var houseRake = Math.round((1 - d[0][0])*10000)/100;
		$("#perc").text(houseRake + "%");
		$("#options_table").removeClass("hidden");
		$("#rakeOpt").noUiSlider({
			range: [0, 15],
			start: houseRake,
			step: 0.5,
			handles: 1,
			slide: function(){
				var values = $(this).val();
				$("#perc").text(
					values + "%"
				);
			}
		});
	});

	$("#options_table").modal();
	$.modal.close();

	var game_start = true,
		push_flag = false,
		ajax_flag = false,
		placed_bet = false,
		can_play = true,
		hands = 0,
		state = 0,
		shuffle_loop = function(j){
			if( game_start ) return;
			if( j > 32 ) return;

			var _this = arguments.callee,
				i = j % 8;
			$("div.card")
			.eq(i)
			.css("z-index", 1000)
			.transition({
				left: (Math.random() > 0.5 ? 90 : -90)+"px",
				marginTop: (Math.random() > 0.5 ? -1 : 1) * (Math.random() * 20 + 5) +"px"
			}, 125, function(){
				$(this).css("z-index", i - 1).transition({
					left: 0+"px",
					marginTop: 0+"px"
				}, 100);
				_this.call(this, j + 1);
			});
		};


	$("button#opts").bind("click", function(){
		$("#options_table").modal();
	});

	$("button#setOptions").bind("click", function(){
		$(this).attr("disabled", true);
		$.post(AJAX_SCRIPT, {
			type: "setopts",
			rake: 1 - $("#rakeOpt").val()/100
		}, function(d){
			$("button#setOptions").removeAttr("disabled");
			$.modal.close();
		});
	});

	$("button#deal").bind("click", function(){
		var hands = [],
			board = [],
			deads = [];
		$(".admin .deadCard input").each(function(i, e){
			if( $(this).val() )
				return deads.push($(this).val().replace(/10/g, "T"));
			$(this).val("");
		});
		$(".admin .boardCard input").each(function(i, e){
			if( $(this).val() )
				return board.push($(this).val().replace(/10/g, "T"));
			$(this).val("");
		});
		$(".admin .holeCard").each(function(i, e){
			var h0 = $(this).find("input").eq(0).val().replace(/10/g, "T"),
				h1 = $(this).find("input").eq(1).val().replace(/10/g, "T");
			if(h0 && h1)
				return hands.push([h0, h1]);
			$(this).find("input").val("");
		});
		$(".admin input").val("");
		$(".hands, .board, .deads").empty();
		$.post(AJAX_SCRIPT, {
			type: "deal",
			hands: hands,
			board: board,
			deads: deads
		}, function(d){
			addHands(hands);
			addBoard(board);
			addDead(deads);
			updateOdds(d);

			$(".hands img").each(function(i, e){
				$(this).parent().parent().find("img").addClass("flip");
				$(this).parent().parent().find(".odds").css("zIndex", 1025012).delay(500).transition({
					opacity: 1
				}, 200);
			})
		});
	});
	
	function addHands(arr){
		for(i = 0; i < arr.length; i++){
			$(".hands").append(
				$("<div />").addClass("hole").addClass("h" + i)
				.append($("<div />").addClass("front").append(
						$("<img />").attr("src", "img/cards/Back.png"),
						$("<img />").attr("src", "img/cards/Back.png")
					),
					$("<div />").addClass("back").append(
						$("<img />").attr("src", "img/cards/" + arr[i][0] + ".png"),
						$("<img />").attr("src", "img/cards/" + arr[i][1] + ".png")
					),
					$("<div />").addClass("odds")
				).click(function(){
					$(this).remove();
				})
			);
		}
	}

	function updateOdds(arr){
		console.log(arr);
		for(i = 0; i < arr.wins.length; i++){
			// Odds
			$(".odds").eq(i).html("Win: <strong>" + round(arr.wins[i]/arr.total) + "</strong><br />" + 
			"Tie: <strong>" + round(arr.ties[i]/arr.total) + "</strong>");
		}
		$(".odds").css("opacity", 0);
	}
	function round(i){
		return Math.floor(i * 10000)/100;
	}
	function addBoard(arr){
		for(i = 0; i < arr.length; i++){
			$(".board").append(
				$("<div />").addClass("hole").addClass("b" + $(".board .hole").length)
				.append($("<div />").addClass("front").append(
						$("<img />").attr("src", "img/cards/Back.png")
					),
					$("<div />").addClass("back").append(
						$("<img />").attr("src", "img/cards/" + arr[i] + ".png")
					)
				).click(function(){
					$(this).remove();
				})
			);
		}
		$(".board img").addClass("flip");
	}
	function addDead(arr){
		for(i = 0; i < arr.length; i++){
			$(".deads").append(
				$("<div />").addClass("hole").addClass("d" + $(".deads .hole").length)
				.append($("<div />").addClass("front").append(
						$("<img />").attr("src", "img/cards/Back.png")
					),
					$("<div />").addClass("back").append(
						$("<img />").attr("src", "img/cards/" + arr[i] + ".png")
					)
				).click(function(){
					$(this).remove();
				})
			);
		}
	}
});