var timeout = setTimeout(function(){
	alert("Your session has timed out");
	window.location.reload();
}, 1801000);

// Get rid of annoying facebook hash
if (window.location.hash == '#_=_') window.location.href = '/';

$(document).ready(function(){
	var AJAX_SCRIPT = "/",
		LOGIN_SCRIPT = "/login/";

	// Check login and load user data
	$.post(LOGIN_SCRIPT, {
		type: "isLoggedIn"
	}, function(d){
		if( d.result === -1 ){
			var nick = prompt("Please enter a public nickname for your account: ", "");
			if( nick === null ) nick = "New User";
			$(".right .email").html(nick);
			$.post(LOGIN_SCRIPT, {
				type: "nick",
				nick: nick
			});
		} else if( d.result !== true ){
			return $("header .right").html("<a href=\"/login/\" class=\"button\">Login</a>");
		}

		can_play = true;
		$("#new_game, #load_game").removeClass("hidden");
		$("header .right").html("Gathering your information...");

		$.post(LOGIN_SCRIPT, {
			type: "getData"
		}, function(d){
			$("header .right").empty().append(
				$("<span />").addClass("email").html(d.nickname),
				$("<span />").addClass("amount").html(d.balance.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")),
				$("<a />").attr({"href": "/logout/", "id":"logout"}).addClass("button").html("Logout").click(function(e){
					navigator.id.logout();
					$("#close_game").click();
					window.location.href = "/logout/";
					e.stopPropagation();
					return false;
				})
			);
		})
	});

	var game_start = false,
		push_flag = false,
		ajax_flag = false,
		placed_bet = false,
		can_play = false,
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
				left: (Math.random() > 0.5 ? 1 : -1) * (window.mobile_version ? 30 : 90) +"px",
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
		if( !can_play ) return alert("Please login to start a new game!");
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
		if( !can_play ) return alert("Please login to load a game!");
		if( ajax_flag ) return;
		return alert("Coming soon");

		ajax_flag = true;
		$.post(AJAX_SCRIPT, {
			type: "load_game"
		}, function(d){
			ajax_flag = false;
			$("#new_game").trigger("click");
		});
	});
	$("#close_game").bind("click", function(){
		if( !can_play ) return alert("Please login to start a new game!");

		reset_game();
		if( $("#close_game").is(":visible") )
			$("#new_game").trigger("click");
	});
	$("button.player").bind("click", function(){
		if( ajax_flag ) return;

		ajax_flag = true;
		$("button.player").attr("disabled", true);
		hands = parseInt($(this).html());
		shuffle_loop(0);
		setTimeout(function(){
			$.post(AJAX_SCRIPT, {
			type: "pre-flop",
			players: hands,
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;
			game_start = true;
			state = 0;

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
				var a = $("<img />").attr("src", "/img/cards/Back.png").addClass("fly").css("zIndex", 10000);
				$("body").append(a);
				a.delay(i * 50).css({
					position: "absolute",
					top: $(".deck").offset().top,
					left: $(".deck").offset().left,
					width: window.mobile_version ? 50 : 100,
					height: window.mobile_version ? 70 : 140,
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
			$(".message").html("<span class=\"bet_placeholder\">You must make at least one bet pre-flop.</span>");
		});
	}, 1300);
	});
	
	$(document).delegate("button.flop", "click", function(){
		if( ajax_flag ) return;

		ajax_flag = true;
		$(this).attr("disabled", true);
		$("button.place_bet").data("currentBet", 0);
		if( hands < 0 )
			$(".bet").hide();

		$.post(AJAX_SCRIPT, {
			type: "flop",
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;

			addBoard(d.board);
			addDead(d.dead);
			updateOdds(d.odds, d.mults);
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
		$(this).attr("disabled", true);
		$("button.place_bet").data("currentBet", 0);
		if( hands < 0 )
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
		$(this).attr("disabled", true);
		$("button.place_bet").data("currentBet", 0);
		$.post(AJAX_SCRIPT, {
			type: "river",
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;

			addBoard(d.board);
			addDead(d.dead);
			updateOdds(d.odds, d.mults);

			$(".bet button").html("Show bets");
			$("button.place_bet").attr("disabled", true);
			var win = Math.floor(d.payout);
			if( win <= 0 ){
				$(".totalWager").each(function(i, e){
					win -= parseInt($(this).html() || "0");
				});
			}

			var n = parseInt($(".right span.amount").html().replace(/,/g, "")),
				p1 = $("<div />").addClass("winout").html((Math.abs(win) + "").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")),
				p2 = $("<div />").addClass("wintitle").html(win < 0 ? "You Lose" : "Payout");

			$(".floor").append(p1, p2);
			p1.transition({
				top: (($(window).height() - p1.outerHeight()) / 2) + "px",
				left: (($(window).width() - p1.outerWidth()) / 2) + "px"
			}, 1);
			p2.css("width", p1.width() + "px").transition({
				top: (($(window).height() - p2.outerHeight()) / 2) - 93 + "px",
				left: (($(window).width() - p2.outerWidth()) / 2) + "px"
			}, 1);
			if( win < 0 ){
				p1.css("color", "red");
				p2.addClass("losetitle");
			}
			p1.animate({
				zIndex: 10240125
			}, 3000, function(){
				p2.animate({opacity: 0}, 500);
				$(this).animateNumber(0, {
					duration: win > 0 ? 2000 : 500,
					animateOpacity: false,
					floatStepDecimals: 0
				}).animate({
					top: ($(".amount").offset().top - 2) + "px",
					left: ($(".amount").offset().left + 20) + "px",
					color: "#AFAFAF",
					fontSize: "16px",
					padding: "0px",
					backgroundColor: "#086264",
					opacity: 0
				}, 2000, function(){
					p2.remove();
					$(this).remove();
				});
				if( win > 0 ){
					$(".right span.amount").animateNumber(n + win, {
						duration: 2000,
						animateOpacity: false,
						floatStepDecimals: 0
					});
				}
			});
			$(".reset").hide();
			$(".message").html("<button class=\"restart\">Play Again</button>");
		});
	});
	$(document).delegate("button.riverPush", "click", function(){
		$(this).attr("disabled", true);
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
		$(this).attr("disabled", true);
		var betAmounts = "",
			totalBets = $("button.place_bet").data("currentBet") || 0;
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
				$("button.place_bet").removeAttr("disabled");
				if( d.status !== 200 ){
					return alert($.parseJSON(d.responseText).error);
				} else {
					$("button.place_bet").data("currentBet", ($("button.place_bet").data("currentBet") || 0) - totalBets);
					var n = parseInt($(".right span.amount").html().replace(/,/g, ""));
					$(".right span.amount").animateNumber(n - totalBets, {
						duration: 500,
						animateOpacity: false,
						floatStepDecimals: 0
					});
					$(".bet_placeholder").html(
						$("<button />").addClass(hands < 0 ? "riverPush" : "flop").html(hands < 0 ? "River" : "Flop")
					);
					$.modal.close();
				}
			}
		});
	});
	$(document).delegate(".reset button", "click", function(){
		if( !confirm("Are you sure you want to reset the game?\nYou will lose all yours bets.")) return;
		reset_game();
		$(".message").html("Choose number of hands to play!");
	});
	
	$(document).delegate("button.restart", "click", function(){
		reset_game();
		$(".message").html("Choose number of hands to play!");
	});
	
	function reset_game(){
		$(".hole, img.fly").stop().remove();
		$(".bet").find("button").html("Place Bets").end().hide();
		$("button").removeAttr("disabled");
		$(".reset").hide();
		$(".ui").show();
		$("#bet_table tbody").empty();
		$("#bet_table .totalWager").empty();
		$("button.place_bet").data("currentBet", "");
		$.modal.close();
		game_start = false;
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			alert("Your session has timed out");
			window.location.reload();
		}, 1801000);
	}

	function updateOdds(arr, m, init){
		if( state == 0 ){
			for(var i = 0; i < arr.wins.length; i++){
				// Bet Table
				$("#bet_table tbody").append(
					$("<tr />").append(
						$("<td />").append(
							$("<span " + init[i][0][1].toLowerCase() + "/>").html(init[i][0][0].replace("T", "10")),
							$("<span " + init[i][1][1].toLowerCase() + "/>").html(init[i][1][0].replace("T", "10"))
						),
						$("<td />").html("<div pre>$</div><input type=\"text\" /> <div am>" + Math.floor(m[i]*100)/100 + "x</div>"),
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
			for(var i = 0; i < arr.wins.length; i++){
				var obj = $(".odds").eq(i).find("strong"),
					newNum = round(arr.wins[i]/arr.total),
					oldNum = parseFloat($(".odds").eq(i).find("strong").eq(0).html());

				var temp = $("#bet_table tbody tr").eq(i).find("input"),
					tf0 = $("#bet_table tfoot tr").eq(1).find("td").eq(state);
				console.log(m[i], Math.floor(m[i] * 100)/100);
				temp.parent().next().html("<input type=\"number\" /> " + ((Math.floor(m[i]*100)/100) || "0") + "x");
				temp.parent().html("$" + (temp.val() || "0") + " (" + temp.parent().text().replace("$", "").trim() + ")");
				tf0.html(parseInt(tf0.html() || 0) + parseInt(temp.val() || 0) + "");

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
				if( state >= 3 && newNum == 100 && !obj.hasClass("winner") ) {
					$(".hands .hole").addClass("faded");
					obj.addClass("winner")
					.parent().parent().removeClass("faded").append($("<div />").addClass("rays"));
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
		state++;
	}
	function round(i){
		return Math.floor(i * 10000)/100;
	}

	function addHands(arr){
		for(var i = 0; i < arr.length; i++){
			$(".hands").append(makeHole("h" + i, arr[i][0], arr[i][1]).append($("<div />").addClass("odds")));
		}
	}

	function addBoard(arr){
		for(var i = 0; i < arr.length; i++){
			$(".board").append(makeHole("b" + $(".board .hole").length, arr[i]));
		}
		$(".board img").addClass("flip");
	}

	function addDead(arr){
		for(var i = 0; i < arr.length; i++){
			$(".deads").append(makeHole("d" + $(".deads .hole").length, arr[i]));
		}
	}

	function makeHole(prefix){
		var f = $("<div />").addClass("front"),
			b = $("<div />").addClass("back"),
			t = $("<div />").addClass("hole").addClass(prefix);
		if( window.mobile_version )
			t.addClass("mobi");
		for(var i = 1;i < arguments.length;i++){
			f.append(
				$("<img />").attr("src", "/img/cards/Back.png")
			);
			b.append(
				$("<img />").attr("src", (window.mobile_version ? "m" : "/img/cards/") + arguments[i] + ".png")
			);
		}
		return t.append(f, b);
	}
});