$(document).ready(function(){
	var AJAX_SCRIPT = "./";
	$.post(AJAX_SCRIPT, {
		type: "game",
		cacheBust: new Date()
	});

	var game_start = false,
		push_flag = false,
		ajax_flag = false,
		placed_bet = false,
		hands = 0,
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
					left: 0+"px", marginTop: 0+"px"
				}, 100);
				_this.call(this, j + 1);
			});
		};

	$("#new_game").bind("click", function(){
		if( ajax_flag ) return;

		var closing = $("#float").hasClass("switched");
		game_start = closing;

		$("#float").toggleClass("switched");

		if( closing ){
			$(".players .card, .board .card, .dead .card").remove();
			$(".ui").show();
		} else {
			shuffle_loop(0);
		}
	});
	$("#load_game").bind("click", function(){
		if( ajax_flag ) return;

		ajax_flag = true;
		$.post(AJAX_SCRIPT, {
			type: "load_game",
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;
			$("#new_game").trigger("click");
		})
	});
	$("#close_game").bind("click", function(){
		reset_game();
		$("#new_game").trigger("click");
	});
	$("button.player").bind("click", function(){
		if( ajax_flag ) return;

		ajax_flag = true;
		hands = parseInt($(this).html());
		$.post(AJAX_SCRIPT, {
			type: "pre-flop",
			players: hands,
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;
			game_start = true;

			addHands(d.hole);
			updateOdds(d.odds, d.mults, d.hole);
			$(".bet").show();

			$(".hands img").each(function(i, e){
				var x = $(e).offset().top,
					y = $(e).offset().left;
				if( $(e).parent().hasClass("front") ){
					return $(e).hide().delay(i * 50 + 5).animate({
						"z-index": 0
					}, function(){
						$(this).show();
					});
				}
				var a = $("<img />").attr("src", "img/cards/Back.png");
				$("body").append(a);
				a.delay(i * 50).css({
					position: "absolute",
					top: $(".deck").offset().top,
					left: $(".deck").offset().left,
					width: 110,
					height: 150,
					"z-index": 1025012 - i
				}).animate({
					top: x,
					left: y
				}, 250, function(){
					$(this).remove();
					$(e).animate({
						"z-index": 0
					}, 100, function(){
						$(this).parent().parent().find("img").addClass("flip");
						$(this).parent().parent().find(".odds").delay(500).animate({
							opacity: 1
						}, 200);
					});
				})
			});
			$(".ui").hide();
			if( hands < 5 ){
				$(".message").html("Place bet now <span class=\"bet_placeholder\"></span>!");
			} else {
				$(".message").html("Place bet now <span class=\"bet_placeholder\"></span>!");
			}
		});
	});
	$(document).delegate("button.flop", "click", function(){
		if( ajax_flag ) return;

		ajax_flag = true;
		if( hands < 5 )
			$(".bet").hide();

		$.post(AJAX_SCRIPT, {
			type: "flop",
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;

			addBoard(d.board);
			addDead(d.dead);
			updateOdds(d.odds, d.mults);
			console.log($(".push.turn"))
			if( push_flag ) {
				$(".push.turn").trigger("click");
			} else {
				$(".message").html("Click <button class=\"turn\">turn</button> or make a bet!");
			}
		});
	});
	$(document).delegate("button.turn", "click", function(){
		if( ajax_flag ) return;
		
		ajax_flag = true;
		if( hands < 5 )
			$(".bet").hide();

		$.post(AJAX_SCRIPT, {
			type: "turn",
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;

			addBoard(d.board);
			addDead(d.dead);
			updateOdds(d.odds, d.mults);

			if( push_flag ) {
				$(".push.river").trigger("click");
			} else {
				$(".message").html("Click <button class=\"river\">river</button> or make a bet!");
			}
		});
	});
	$(document).delegate("button.river", "click", function(){
		if( ajax_flag ) return;

		ajax_flag = true;
		$(".bet").hide();
		$(".payout").show();

		$.post(AJAX_SCRIPT, {
			type: "river",
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;

			addBoard(d.board);
			addDead(d.dead);
			updateOdds(d.odds, d.mults);

			$(".message").html("<button class=\"restart\">New Game</button>");
		});
	});
	$(document).delegate("button.riverPush", "click", function(){
		var a = $("<button />").addClass("flop"),
			b = $("<button />").addClass("turn push"),
			c = $("<button />").addClass("river push").click(function(){
				push_flag = false;
			});
		push_flag = true;

		$("body").append(a);
		$("body").append(b);
		$("body").append(c);
		a.trigger("click");
	});
	$(".bet").bind("click", function(){
		$("#bet_table").modal({
			zIndex: 100000
		});
	}).hide();
	$(".payout").bind("click", function(){
		$.post(AJAX_SCRIPT, {
			type: "history"
		}, function(d){
			$("#payout_table").html(d).modal({
				zIndex: 100000
			});
		})
	}).hide();

	// Initialize Modal
	$("#bet_table").modal();
	$.modal.close();
	$("#payout_table").modal();
	$.modal.close();

	$(document).delegate("button.place_bet", "click", function(){
		if( ajax_flag ) return;

		ajax_flag = true;
		var betAmounts = "";
		$("#bet_table input").each(function(i,e){
			betAmounts += " " + $(e).val();
		});
		betAmounts = betAmounts.substring(1).split(" ");
		$.ajax(AJAX_SCRIPT, {
			type: "POST",
			data: {
				type: "bet",
				amounts: betAmounts
			},
			complete: function(d){
				ajax_flag = false;
				if( d.status !== 200 ){
					var err = $.parseJSON(d.responseText).error;
					alert(err);
				} else {
					$(".bet_placeholder").html(
						$("<button />").addClass(hands < 5 ? "riverPush" : "flop").html(hands < 5 ? "River" : "Flop")
					);
					$.modal.close();
				}
			}
		});
	});
	$(document).delegate("button.restart", "click", function(){
		reset_game();
		$(".message").html("Choose number of hands to play!");
	});
	
	function reset_game(){
		$(".hole").remove();
		$(".bet").hide();
		$(".ui").show();
		$("#bet_table tbody").empty();
		game_start = false;
		shuffle_loop(0);
	}

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
				)
			);
		}
	}

	function updateOdds(arr, m, init){
		if( $(".odds").eq(0).html() == "" ){
			for(i = 0; i < arr.wins.length; i++){
				// Bet Table
				$("#bet_table tbody").append(
					$("<tr />").append(
						$("<td />").append(
							$("<span " + init[i][0][1].toLowerCase() + "/>").html(init[i][0][0]),
							$("<span " + init[i][1][1].toLowerCase() + "/>").html(init[i][1][0])
						),
						$("<td />").html(round(arr.wins[i]/arr.total) + "%"),
						$("<td />").html(Math.round(m[i]*10)/10 + "x"),
						$("<td />").html("<input type=\"number\" />")
					)
				);

				// Odds
				$(".odds").eq(i).html("W: <strong>" + round(arr.wins[i]/arr.total) + "</strong><br />" + 
				"T: <strong>" + round(arr.ties[i]/arr.total) + "</strong>");
			}
			$(".odds").css("opacity", 0);
		} else {
			for(i = 0; i < arr.wins.length; i++){

				var obj = $(".odds").eq(i).find("strong"),
					newNum = round(arr.wins[i]/arr.total),
					oldNum = parseFloat($(".odds").eq(i).find("strong").eq(0).html());
				
				obj.eq(0).animateNumber(newNum, {
					duration: 500,
					animateOpacity: false,
					floatStepDecimals: 2
				}).stop().css("color", newNum > oldNum ? "#00dd00" : "#dd0000").animate({
					color: "#000000"
				}, 5000);

				obj.eq(1).animateNumber(round(arr.ties[i]/arr.total), {
					duration: 500,
					animateOpacity: false,
					floatStepDecimals: 2,
					floatEndDecimals: 4
				});

				if( newNum == 100 ) obj.parent().parent().append($("<div />").addClass("rays"));
				if( oldNum >= newNum ) continue;

				obj.parent().parent().animate({
					top: "-=10px"
				}, {duration:150,queue:false, complete: function(){
						$(this).animate({
							top: "+=10px"
						}, {duration:150,queue:false, complete: function(){
								$(this).animate({
									top: "-=10px"
								}, {duration:150,queue:false, complete: function(){
										$(this).animate({
											top: "+=10px"
										}, {duration:150,queue:false});
									}
								});
							}
						});
					}
				});
			}
		}
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
				)
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
				)
			);
		}
	}
	/*$("#handcount").mobiscroll().select({
        theme: "ios",
        display: "inline",
        mode: "scroller",
        inputClass: 'i-txt',
        label: "",
        width: 50
    });*/
});