<html>
<head>
	<title>Ala-Poker</title>
</head>

<?php
	
	error_reporting(E_ALL);
	ini_set("display_errors", true);
	$deck;
	
	buildDeck();
	shuffleDeck();

	var_dump($deck);

	function buildDeck()
	{
		global $deck;
		$deck = array();

		$kinds = array("2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"); // T - 10
		$suits = array("S", "H", "D", "C"); // spades, hearts, diamonds, clubs

		for($s = 0; $s < count($suits); $s++)
			for($k = 0; $k < count($kinds); $k++)
				$deck[$s * count($kinds) + $k] = $kinds[$k] . $suits[$s];
	}

	function shuffleDeck() {

		global $deck;
		shuffle($deck);	

	}

?>

<html>