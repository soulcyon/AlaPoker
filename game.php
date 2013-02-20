<?php
	
	error_reporting(E_ALL);
	ini_set("display_errors", true);
	session_start();

	if(!isset($_POST['players'])) {
		Header("Location: index.html");
	}

	$deck;
	$players = $_POST['players'];
	$dealt = array();
	$board = array();
	
	build_deck();
	deal_cards();
	bet();
	
	flop();
	bet();
	
	turn();
	bet();
	
	river();
	
	end_game();
	payout();

	function build_deck() {

		global $deck;
		$deck = array();

		$kinds = array("2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"); // T - 10
		$suits = array("S", "H", "D", "C"); // spades, hearts, diamonds, clubs

		for($s = 0; $s < count($suits); $s++)
			for($k = 0; $k < count($kinds); $k++)
				$deck[$s * count($kinds) + $k] = $kinds[$k] . $suits[$s];
	}

	function shuffle_deck() {

		global $deck;
		shuffle($deck);

	}

	function deal_cards() {
		
		global $deck, $players, $dealt;
	
		shuffle_deck();

		// players dealt here
		for($i = 0; $i < $players; $i++) {
			$dealt[$i] = array($deck[$i], $deck[$i + $players]);
		}
	
		// inject html to show players' cards
		for($i = 0; $i < count($dealt); $i++) {
			for($j = 0; $j < count($dealt[$i]); $j++) {
				echo '<img src="Cards/' . $dealt[$i][$j] . '.png" alt="'. $dealt[$i][$j] . '">';
			}
			echo "<br/>";
		}
	}

	function flop() {
		
		global $deck, $players, $board;

		$i = 2 * $players;
		$board[0] = $deck[$i + 1]; // burn one
		$board[1] = $deck[$i + 2];
		$board[2] = $deck[$i + 3];
		
		// inject html to show flop cards
		for($i = 0; $i < 3; $i++) {
			echo '<img src="Cards/' . $board[$i] . '.png" alt="'. $board[$i] . '">';
		}
	}

	function turn() {
		
		global $deck, $players, $board;
		
		$i = 2 * $players + 4;
		$board[3] = $deck[$i + 1]; // burn one

		// inject html to show turn card
		echo '<img src="Cards/' . $board[3] . '.png" alt="'. $board[3] . '">';

	}

	function river() {
		
		global $deck, $players, $board;

		$i = 2 * $players + 6;
		$board[4] = $deck[$i + 1]; // burn one

		// inject html to show river card
		echo '<img src="Cards/' . $board[4] . '.png" alt="'. $board[4] . '">';

	}

	function bet() {

	}

	function end_game() {

		global $board, $dealt;
	
		//determine winner here
	}

	function payout() {
		// payout with house edge
	}
?>