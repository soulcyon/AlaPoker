$(document).ready(function(){
	var AJAX_SCRIPT = "./",
		LOGIN_SCRIPT = "./login.php";
	$.post(AJAX_SCRIPT, {
		type: "game",
		cacheBust: new Date()
	});

	// Load user data
	$.post(LOGIN_SCRIPT, {
		type: "isLoggedIn"
	}, function(d){
		if( d !== true ){
			return $("header .right").html("<a href=\"login.php?type=showLogin\"><button>Login</button></a>");
		}
		$("header .right").html("Gathering your information...");
		$.post(LOGIN_SCRIPT, {
			type: "getData"
		}, function(d){
			$("header .right").empty().append(
				$("<span />").addClass("email").html(d.email),
				$("<span />").addClass("amount").html(d.balance.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"))
			);
		})
	})

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
					left: 0+"px",
					marginTop: 0+"px"
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
		}
	});
	$("#load_game").bind("click", function(){
		if( ajax_flag ) return;
		return alert("Coming soon");

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
		shuffle_loop(0);
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
			$(".reset").show();

			$(".hands img").each(function(i, e){
				var x = $(e).offset().top,
					y = $(e).offset().left;
				if( $(e).parent().hasClass("front") ){
					return $(e).hide().delay(i * 50 + 5).transition({
						"z-index": 0
					}, function(){
						$(this).show();
					});
				}
				var a = $("<img />").attr("src", "img/cards/Back.png").addClass("fly").css("zIndex", 10000);
				$("body").append(a);
				a.delay(i * 50).css({
					position: "absolute",
					top: $(".deck").offset().top,
					left: $(".deck").offset().left,
					width: 110,
					height: 150,
					"z-index": 1025012 - i
				}).transition({
					top: x,
					left: y
				}, 250, function(){
					$(this).remove();
					$(e).animate({
						"z-index": 0
					}, 400, function(){
						$(this).parent().parent().find("img").addClass("flip");
						$(this).parent().parent().find(".odds").delay(500).transition({
							opacity: 1
						}, 200);
					});
				})
			});
			$(".ui").hide();
			$(".message").html("<span class=\"bet_placeholder\">You must place bets pre-flop</span>!");
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
		$(".bet button").html("Show bets");

		$.post(AJAX_SCRIPT, {
			type: "river",
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;

			addBoard(d.board);
			addDead(d.dead);
			updateOdds(d.odds, d.mults);

			var n = parseInt($(".right span.amount").html().replace(/,/g, "")),
				win = Math.round(d.payout),
				p1 = $("<div />").addClass("winout").html((win + "").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")),
				p2 = $("<div />").addClass("wintitle").html("You Win!");
			if( win > 0 ){
				$(".floor").append(p1, p2);
				p2.css({
					top: (($(window).height() - p2.outerHeight()) / 2) - 40 + "px",
					left: (($(window).width() - p2.outerWidth()) / 2) + "px",
					zIndex: 10240126
				});
				p1.css({
					top: (($(window).height() - p1.outerHeight()) / 2) + "px",
					left: (($(window).width() - p1.outerWidth()) / 2) + "px"
				}).animate({
					zIndex: 10240125
				}, 3000, function(){
					p2.animate({opacity: 0}, 500);
					$(this).animateNumber(0, {
						duration: 2000,
						animateOpacity: false,
						floatStepDecimals: 0
					}).animate({
						top: ($(".amount").offset().top - 2) + "px",
						left: ($(".amount").offset().left + 20) + "px",
						color: "#AFAFAF",
						fontSize: "16px",
						padding: "0px",
						background: "rgba(0, 0, 0, 0)",
						opacity: 0
					}, 2000, function(){
						p2.remove();
						$(this).remove();
					});
					$(".right span.amount").animateNumber(n + win, {
						duration: 2000,
						animateOpacity: false,
						floatStepDecimals: 0
					});
				})
			}
			$(".reset").hide();
			$(".message").html("<button class=\"restart\">Play Again</button>");
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
	$(".reset").hide();
	$(".bet").bind("click", function(){
		$("#bet_table").modal({
			zIndex: 100000
		});
	}).hide();

	// Initialize Modal
	$("#bet_table").modal();
	$.modal.close();

	$(document).delegate("button.place_bet", "click", function(){
		if( ajax_flag ) return;

		ajax_flag = true;
		var betAmounts = "",
			totalBets = 0;
		$("#bet_table input").each(function(i,e){
			betAmounts += " " + $(e).val();
			totalBets += parseInt($(e).val()) || 0;
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
					var n = parseInt($(".right span.amount").html().replace(/,/g, ""));
					$(".right span.amount").animateNumber(n - totalBets, {
						duration: 500,
						animateOpacity: false,
						floatStepDecimals: 0
					});
					$(".bet_placeholder").html(
						$("<button />").addClass(hands < 5 ? "riverPush" : "flop").html(hands < 5 ? "River" : "Flop")
					);
					$.modal.close();
				}
			}
		});
	});
	$(document).delegate(".reset button, button.restart", "click", function(){
		reset_game();
		$(".message").html("Choose number of hands to play!");
	});
	
	function reset_game(){
		$(".hole, img.fly").stop().remove();
		$(".bet").find("button").html("Place Bets").end().hide();
		$(".reset").hide();
		$(".ui").show();
		$("#bet_table tbody").empty();
		$.modal.close();
		game_start = false;
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
						$("<td />").html("<div pre>$</div><input type=\"text\" /> <div am>" + Math.round(m[i]*10)/10 + "x</div>"),
						$("<td />"),
						$("<td />")
					)
				);
				// Odds
				$(".odds").eq(i).html("Win: <strong>" + round(arr.wins[i]/arr.total) + "</strong><br />" + 
				"Tie: <strong>" + round(arr.ties[i]/arr.total) + "</strong>");
			}
			$(".odds").css("opacity", 0);
		} else {
			for(i = 0; i < arr.wins.length; i++){
				var obj = $(".odds").eq(i).find("strong"),
					newNum = round(arr.wins[i]/arr.total),
					oldNum = parseFloat($(".odds").eq(i).find("strong").eq(0).html());

				var temp = $("#bet_table tbody tr").eq(i).find("input");
				temp.parent().next().html("<input type=\"number\" /> " + Math.round(m[i]*10)/10 + "x");
				temp.parent().html("$" + (temp.val() || "0") + " (" + temp.parent().text().substring(2) + ")");

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

				if( newNum == 100 ) {
					$(".hands .hole").addClass("faded");
					obj.parent().parent().removeClass("faded").append($("<div />").addClass("rays"));
				}
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