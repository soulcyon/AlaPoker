<?php
	
	error_reporting(E_ALL);
	ini_set("display_errors", true);
	session_start();

	$deck = $_SESSION['deck'] = build_deck();
	$players = $_POST['players'];
	$cards;
	
	shuffle_deck();
	
	deal_hands();
	bet();
	
	flop();
	bet();
	
	turn();
	bet();
	
	river();
	pay_out();

	if(!isset($_POST['players'])) {
		Header("Location: index.html");
	}

	function deal_hands() {
		
		global $deck, $players, $cards;
		$cards = array();

		// player cards
		for($i = 0; $i < $players; $i++) {
			$cards[$i] = array($deck[$i], $deck[$i + $players]);
		}

		print_r($cards);

	}

	function flop() {
		
		global $deck, $players, $cards;
		$players = $_POST['players'];

		print_r($cards);

	}

	function turn() {
		
		global $deck, $players, $cards;
		$players = $_POST['players'];
		$cards = array();

		print_r($cards);

	}

	function river() {
		
		global $deck, $players, $cards;
		$players = $_POST['players'];
		$cards = array();

		print_r($cards);

	}

	function bet() {

	}

	function pay_out() {

	}

	// deck functions

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

	function printDeck() {

		global $deck;
		print_r($deck);
	}

?>