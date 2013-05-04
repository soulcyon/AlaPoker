var timeout = setTimeout(function(){
	window.location.reload();
}, 1801000);

// Get rid of unnecessary hashes
if (window.location.hash == '#http://blog.alapoker.net') window.location.hash = '';
if (window.location.hash == '#_=_') window.location.href = '/';

$(document).ready(function(){
	var AJAX_SCRIPT = "/game/",
		LOGIN_SCRIPT = "/auth/";

	// Check login and load user data
	$.post(LOGIN_SCRIPT + "verify", {}, function(d){
		$("body").css("display", "block");
		if( d.result === -1 ){
			var nick = prompt("Please enter a public nickname for your account: ", "");
			if( nick === null ) nick = "New User";
			$.post(LOGIN_SCRIPT + "nick", {
				nick: nick
			}, function(d){
				$("#left .name").html(nick);
			});
		} else if( d.result !== true ){
			shuffle_loop(0);
			$.getScript("/js/login.js", function(){
				console.log("login script loaded");
			});
			return $("body").find("#ui").hide().end().find("#header2").show();
		} else {
			$("#message").html("Choose number of hands to play.");
			navigator.id.watch({
			    onlogin: function(assertion) {
			    },
			    onlogout: function(){
			    }
			});
		}

		can_play = true;
		$.post(LOGIN_SCRIPT + "data", {}, function(d){
			$("#header3 .name").html(d.nickname);
			$("#header3 span[money]").html(prettyNum(d.balance));
			$("#bet_data .balance span[money]").html(prettyNum(parseInt($("#right span[money]").text().replace(/,/g,""))));
			$("#header3 #logout").click(function(e){
				$(this).animate({
					right: "-100px"
				}, 125);
				e.stopPropagation();
				if( placed_bet ) return false;

				navigator.id.logout();
			    window.location.href = "/logout";
				return false;
			});
		});
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
			.css("z-index", 500)
			.animate({
				left: (Math.random() > 0.5 ? 1 : -1) * (window.mobile_version ? 30 : 90) +"px",
				marginTop: (Math.random() > 0.5 ? -1 : 1) * (Math.random() * 20 + 5) +"px"
			}, 125, function(){
				$(this).css("z-index", i - 1).animate({
					left: 0+"px",
					marginTop: 0+"px"
				}, 100);
				_this.call(this, j + 1);
			});
		};

	$("button.player").bind("click", function(){
		if( ajax_flag ) return;

		ajax_flag = true;
		$("button.player").attr("disabled", true);
		hands = parseInt($(this).html());
		shuffle_loop(0);
		setTimeout(function(){
			$.post(AJAX_SCRIPT + "preFlop", {
			players: hands,
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;
			game_start = true;
			state = 0;

			addHands(d.hole);
			updateOdds(d.odds, d.mults, d.hole);
			$("#bet").show();
			$("#reset").show();

			var len = $("#hands .hole").length,
				holePositions = [0,2,4,6,8,9,7,5,3,1],
				lessDelay = 0;
			$("#hands .front img").css("opacity", 0);
			for(var o = 0; o < holePositions.length; o++){
				if( holePositions[o] >= len ) {
					lessDelay++;
					continue;
				}
				var i = holePositions[o],
					off = $("#hands .front").eq(i).find("img").eq(0).offset(),
					a = $("<img />").attr("src", "/img/Back.png").addClass("fly").data("i", i),
					newLeft = off.left,
					newTop = off.top;
				$("body").append(a);
				a.delay((o - lessDelay) * 100).css({
					position: "absolute",
					top: $("#deck").offset().top,
					left: $("#deck").offset().left,
					width: window.mobile_version ? 50 : 100,
					height: window.mobile_version ? 70 : 140,
					zIndex: 500 - i
				}).animate({
					top: newTop,
					left: newLeft
				}, 250, function(){
					$("#hands .front").eq($(this).data("i")).find("img").eq(0).css("opacity", 1);
					$(this).remove();
					$(this).animate({
						zIndex: 0
					}, len * 200, function(){
						$("#hands img").addClass("flip");
					})
				});
			}
			lessDelay = 0;
			for(var o = 0; o < holePositions.length; o++){
				if( holePositions[o] >= len ) {
					lessDelay++;
					continue;
				}
				var i = holePositions[o],
					off = $("#hands .front").eq(i).find("img").eq(1).offset(),
					a = $("<img />").attr("src", "/img/Back.png").addClass("fly").data("i", i),
					newLeft = off.left,
					newTop = off.top;
				$("body").append(a);
				a.delay((o - lessDelay) * 100 + len*100).css({
					position: "absolute",
					top: $("#deck").offset().top,
					left: $("#deck").offset().left,
					width: window.mobile_version ? 50 : 100,
					height: window.mobile_version ? 70 : 140,
					zIndex: 500 - i
				}).animate({
					top: newTop,
					left: newLeft
				}, 250, function(){
					$("#hands .front").eq($(this).data("i")).find("img").eq(1).css("opacity", 1);
					$(this).remove();
				});
			}
			$("#ui").hide();
			$("#message").html("<span class=\"bet_placeholder\">You must make at least one bet pre-flop.</span>");
		});
	}, 1300);
	});
	
	$(document).delegate("button.flop", "click", function(){
		if( ajax_flag ) return;

		ajax_flag = true;
		$(this).attr("disabled", true);
		$("button.place_bet").data("currentBet", 0);
		if( hands < 0 )
			$("#bet").hide();

		$.post(AJAX_SCRIPT + "flop", {
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;

			addBoard(d.board);
			addDead(d.dead);
			updateOdds(d.odds, d.mults);

			if( push_flag ) {
				$(".push.turn").trigger("click");
			} else {
				$("#message").html("Click <button class=\"turn button\">turn</button> or make a bet!");
			}
		});
	});
	$(document).delegate("button.turn", "click", function(){
		if( ajax_flag ) return;
		
		ajax_flag = true;
		$(this).attr("disabled", true);
		$("button.place_bet").data("currentBet", 0);
		if( hands < 0 )
			$("#bet").hide();

		$.post(AJAX_SCRIPT + "turn", {
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;

			addBoard(d.board);
			addDead(d.dead);
			updateOdds(d.odds, d.mults);

			if( push_flag ) {
				$(".push.river").trigger("click");
			} else {
				$("#message").html("Click <button class=\"river button\">river</button> or make a bet!");
			}
		});
	});
	$(document).delegate("button.river", "click", function(){
		if( ajax_flag ) return;

		ajax_flag = true;
		$(this).attr("disabled", true);
		$("button.place_bet").data("currentBet", 0);
		$.post(AJAX_SCRIPT + "river", {
			cacheBust: new Date()
		}, function(d){
			ajax_flag = false;
			game_start = false;
			placed_bet = false;
			
			addBoard(d.board);
			addDead(d.dead);
			updateOdds(d.odds, d.mults);

			$("#bet button").html("Show bets");
			$("button.place_bet").attr("disabled", true);
			$("#hands").addClass("gameover");

			var win = Math.floor(d.payout);
			var wagerSum = 0;
			$(".totalWager").each(function(i,e){wagerSum += parseInt($(this).text() || 0);});
			$("#bet_data .wager span[money]").html(prettyNum(wagerSum));
			if( win <= 0 ){
				$(".totalWager").each(function(i, e){
					win -= parseInt($(this).html() || "0");
				});
				wagerSum = 0;
			}
			var payout = -(wagerSum - win);
			$("#bet_data .payout span[money]").html((payout > 0 ? "+" : "-") + prettyNum(Math.abs(payout)));	

			var n = parseInt($("#bet_data .balance span[money]").html().replace(/,/g, "")),
				p1 = $("<div />").addClass("winout").html(prettyNum(Math.abs(win))),
				p2 = $("<div />").addClass("wintitle").html(win < 0 ? "You Lose" : "Payout");

			$(".floor").append(p1, p2);
			p1.animate({
				top: (($(window).height() - p1.outerHeight()) / 2) + "px",
				left: (($(window).width() - p1.outerWidth()) / 2) + "px"
			}, 1);
			p2.css("width", p1.width() + "px").animate({
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
					top: ($("#bet_data .balance span[money]").offset().top - 2) + "px",
					left: ($("#bet_data .balance span[money]").offset().left + 20) + "px",
					color: "#AFAFAF",
					fontSize: "16px",
					padding: "0px",
					backgroundColor: "#086264",
					opacity: 0
				}, 2000, function(){
					p2.remove();
					$(this).remove();
				});
				if( n + win > 0 ){
					$("#right span[money]").css("color", "green").animate({"color": "rgb(239, 239, 239)"});
				} else {
					$("#right span[money]").css("color", "red").animate({"color": "rgb(239, 239, 239)"});
				}
				$("#right span[money], #bet_data .balance span[money]").animateNumber(n + win, {
					duration: 2000,
					animateOpacity: false,
					floatStepDecimals: 0
				});
			});
			$("#reset").hide();
			$("#message").html("<button class=\"restart button\">Play Again</button>");
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
	$("#reset").hide();
	$("#bet").bind("click", function(){
		$("#bet_table").modal({
			zIndex: 100000
		});
	}).hide();

	// Initialize Modal
	$("#bet_table").modal();
	$.modal.close();
	$("#logindialog").modal();
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
		$.ajax(AJAX_SCRIPT + "bet", {
			type: "POST",
			data: {
				amounts: betAmounts
			},
			complete: function(d){
				ajax_flag = false;
				if( !$("button.place_bet").data("won") )
					$("button.place_bet").removeAttr("disabled");
				if( d.status !== 200 ){
					return alert($.parseJSON(d.responseText).error);
				} else {
					placed_bet = true;
					$("button.place_bet").data("currentBet", ($("button.place_bet").data("currentBet") || 0) - totalBets);
					var n = parseInt($("#bet_data .balance span[money]").html().replace(/,/g, ""));
					$("#bet_data .wager span[money]").animateNumber(totalBets, {
						duration: 500,
						animateOpacity: false,
						floatStepDecimals: 0
					});
					$("#bet_data .balance span[money]").animateNumber(n - totalBets, {
						duration: 500,
						animateOpacity: false,
						floatStepDecimals: 0
					});
					if( state == 1 )
						$("#message").html(
							$("<button />").addClass(hands < 0 ? "riverPush button" : "flop button").html(hands < 0 ? "River" : "Flop")
						);

					$.modal.close();
				}
			}
		});
	});
	$(document).delegate("#reset button", "click", function(){
		if( placed_bet && !confirm("Are you sure you want to reset the game?\nYou will lose all yours bets.")) return;
		reset_game();
	});
	$(document).delegate("button.restart", "click", function(){
		reset_game();
	});

	window.onbeforeunload = function() {
		if( placed_bet )
			return "Are you sure you want to reset the game?\nYou will lose all yours bets.";
	};
	
	$(document).delegate("button.restart", "click", function(){
		reset_game();
		$("#message").html("Choose number of hands to play!");
	});

	function prettyNum(i){
		return (i+"").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
	function reset_game(){
		$("#message").html("Choose number of hands to play!");
		$(".hole, img.fly").stop().remove();
		$("#bet").find("button").html("Place Bets").end().hide();
		$("button").removeAttr("disabled");
		$("#reset").hide();
		$("#winnings").hide();
		$("#ui").show();
		$("#bet_table tbody").empty();
		$("#bet_table .totalWager").empty();
		$("button.place_bet").data("currentBet", "").data("won", false);
		$("#hands").removeClass("gameover");
		$("#bet_data p:not(.balance) span[money]").html(0);

		$.modal.close();
		game_start = false;
		placed_bet = false;
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			alert("Your session has timed out");
			window.location.reload();
		}, 1801000);
	}

	function updateOdds(arr, m, init){
		if( state == 0 && init ){
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
		} else {
			for(var i = 0; i < arr.wins.length; i++){
				var obj = $(".odds").eq(i).find("strong"),
					newNum = round(arr.wins[i]/arr.total),
					oldNum = parseFloat($(".odds").eq(i).find("strong").eq(0).html());
					
				var temp = $("#bet_table tbody tr").eq(i).find("td").eq(state),
					tf0 = $("#bet_table tfoot tr").eq(1).find("td").eq(state);

				m[i] = m[i] || 0;

				tf0.html((parseInt(tf0.html() || 0) + parseInt(temp.find("input").val() || 0)) + "");
				temp.next().html("<input type=\"number\" /> " + ((Math.floor(m[i]*100)/100) || "0") + "x");
				temp.html("$" + (temp.find("input").val() || "0") + " (" + temp.text().replace("$", "").trim() + ")");

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
				if( state >= 2 && newNum == 100 && !obj.hasClass("winner") ) {
					$("#hands .hole").addClass("faded");
					obj.addClass("winner")
					.parent().parent().removeClass("faded").prepend($("<div />").addClass("rays"));

					$("#bet button").html("Show bets");
					$("button.place_bet").data("won", true).attr("disabled", true);
					$("#bet_table input").remove();
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
			$("#hands").append(makeHole("h" + i, arr[i][0], arr[i][1]).append($("<div />").addClass("odds")));
		}
	}

	function addBoard(arr){
		for(var i = 0; i < arr.length; i++){
			$("#board").append(makeHole("b" + $("#board .hole").length, arr[i]));
		}
		$("#board img").addClass("flip");
	}

	function addDead(arr){
		for(var i = 0; i < arr.length; i++){
			$("#deads").append(makeHole("d" + $("#deads .hole").length, arr[i]));
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
				$("<img />").attr("src", "/img/Back.png")
			);
			b.append(
				$("<img />").attr("src", (window.mobile_version ? "m" : "/img/") + arguments[i] + ".png")
			);
		}
		return t.append(f, b);
	}

	$(".janrainEngage").click(function(){
		$("#janrainView div > div > a").parent().hide();
	});
});