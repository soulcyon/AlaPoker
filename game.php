<?php
	
	error_reporting(E_ALL);
	ini_set("display_errors", true);
	session_start();

	if(!isset($_POST['players'])) {
		Header("Location: index.html");
	}

	$deck = $_SESSION['deck'] = build_deck();
	$players = $_POST['players'];
	$dealt = array();
	$board = array();
	
	build_deck();
	shuffle_deck();

	deal_cards();
	bet();
	
	flop();
	bet();
	
	turn();
	bet();
	
	river();
	pay_out();

	end_game();

	function deal_cards() {
		
		global $deck, $players, $dealt;

		// players dealt here
		for($i = 0; $i < $players; $i++) {
			$dealt[$i] = array($deck[$i], $deck[$i + $players]);
		}

	}

	function flop() {
		
		global $deck, $players, $board;

		$i = 2 * $players;
		$board[0] = $deck[$i + 1]; // burn one
		$board[1] = $deck[$i + 2];
		$board[2] = $deck[$i + 3];
	}

	function turn() {
		
		global $deck, $players, $board;
		
		$i = 2 * $players + 4;
		$board[3] = $deck[$i + 1]; // burn one

	}

	function river() {
		
		global $deck, $players, $board;

		$i = 2 * $players + 6;
		$board[4] = $deck[$i + 1]; // burn one

	}

	function bet() {

	}

	function pay_out() {

	}

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

	function end_game() {

		global $board, $dealt;

		// dealt players
		for($i = 0; $i< count($dealt); $i++) {
			echo "Player " . ($i + 1) . ": " . $dealt[$i][0] . " " . $dealt[$i][1] . "<br/>";
		}

		// board
		echo "Board: "; 
		for($i = 0; $i < count($board); $i++) {
			echo $board[$i] . " ";
		}
		echo "<br/>";
	}
	for($i = 0; $i < count($dealt); $i++){
		for($j = 0; $j < count($dealt[$i]); $j++){
		echo  '<img src="Cards/'.$dealt[$i][$j].'.png" alt="Random Hand">';
		}
		echo "<br/>";
	}
?>