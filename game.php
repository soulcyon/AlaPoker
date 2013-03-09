<?php
	error_reporting(E_ALL);
	ini_set("pokenum.iterations", 100000);
	ini_set("display_errors", true);
	session_start();

	if(isset($_POST["calc"]) && $_POST["calc"] == "true"){
		Header("Content-type: application/json");
		if( isset($_POST["c"]) && $_POST["c"] == "true" && !isset($_POST["r"]) ){
			$r = pokenum(PN_TEXAS, explode(",",$_POST["h"]), $_POST["b"], $_POST["d"]);
			$wins = array();
			$ties = array();
			foreach($r["hands"] as $hand){
				$wins[] = $hand["win"];
				$ties[] = $hand["tie"];
			}
			die(json_encode(array("wins" => $wins, "ties" => $ties, "total" => $r["iterations"])));
		} else {
			require_once("lib/AlaPoker.php");
			$ala = new AlaPoker($_POST["h"], $_POST["b"], $_POST["d"]);
			die(json_encode($ala->getOdds()));
		}
	}

	if(!isset($_POST['players'])) {
		Header("Location: index.html");
	}

	$kinds = array("2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"); // T - 10
	$suits = array("C", "D", "H", "S"); // clubs, diamonds, hearts, spades

	$deck;
	$players = $_POST['players'];

	$dealt = array();
	$board = array();
	$dead = array();
	
	buildDeck();
	dealCards();
	bet();

	echo "<button id='pre'>P</button>";
	echo "<button id='flop'>F</button>";
	echo "<button id='turn'>T</button>";
	echo "<button id='river'>R</button><br />Use Monte Carlo: <input type='checkbox' id='flag' /><br />";

	flop();
	bet();
	
	turn();
	bet();
	
	river();
	
	endGame();
	payout();

	echo "<br /><div class='panels'><div class='panel'><div class='front'><img src='Cards/Back.png' class='burn community' /></div>";
	echo "<div class='back'><img src='Cards/$dead[0].png' alt='$dead[0]' class='burn community' /></div></div>";
	echo "<div class='panel'><div class='front'><img src='Cards/Back.png' class='burn community' /></div>";
	echo "<div class='back'><img src='Cards/$dead[1].png' alt='$dead[1]' class='burn community' /></div></div>";
	echo "<div class='panel'><div class='front'><img src='Cards/Back.png' class='burn community' /></div>";
	echo "<div class='back'><img src='Cards/$dead[2].png' alt='$dead[2]' class='burn community' /></div></div></div>";
	//echo "<input type='hidden' id='dead' value='" . implode(' ', $dead) . "' />";
	

	function buildDeck() {

		global $deck, $kinds, $suits;
		$deck = array();

		for($s = 0; $s < count($suits); $s++)
			for($k = 0; $k < count($kinds); $k++)
				$deck[$s * count($kinds) + $k] = $kinds[$k] . $suits[$s];
	}

	function shuffleDeck() {

		global $deck;
		shuffle($deck);

	}

	function dealCards() {
		
		global $deck, $players, $dealt;
	
		shuffleDeck();
		
		// players dealt here
		for($i = 0; $i < $players; $i++) {
			$dealt[$i] = bubbleUp($deck[$i], $deck[$i + $players]);
		}
		// inject html to show players' cards
		for($i = 0; $i < count($dealt); $i++) {
			echo '<p class="hand">';
			for($j = 0; $j < count($dealt[$i]); $j++) {
				echo '<img src="Cards/' . $dealt[$i][$j] . '.png" alt="'. $dealt[$i][$j] . '">';
			}
			echo '</p>';
		}
		echo "<div class='break'></div>";
	}

	function bubbleUp($c1, $c2) {
		
		global $kinds, $suits;
		
		$k1 = array_search($c1{0}, $kinds);
		$k2 = array_search($c2{0}, $kinds);

		if($k1 > $k2) {
			return array($c1, $c2);
		}
		
		else if($k1 < $k2) {
			return array($c2, $c1);
		}

		else {
			
			$s1 = array_search($c1{1}, $suits);
			$s2 = array_search($c2{1}, $suits);
			
			if($s1 > $s2) {
				return array($c1, $c2);
			}
			else if($s1 < $s2) {
				return array($c2, $c1);
			}
		}
	}

	function flop() {
		
		global $deck, $players, $board, $dead;

		$i = 2 * $players;
		$dead[0] = $deck[$i];
		$board[0] = $deck[$i + 1]; // burn one
		$board[1] = $deck[$i + 2];
		$board[2] = $deck[$i + 3];
		
		// inject html to show flop cards
		for($i = 0; $i < 3; $i++) {
			echo '<img src="Cards/' . $board[$i] . '.png" alt="'. $board[$i] . '" class="flop community">';
		}
	}

	function turn() {
		
		global $deck, $players, $board, $dead;
		
		$i = 2 * $players + 4;
		$dead[1] = $deck[$i];
		$board[3] = $deck[$i + 1]; // burn one

		// inject html to show turn card
		echo '<img src="Cards/' . $board[3] . '.png" alt="'. $board[3] . '" class="turn community">';

	}

	function river() {
		
		global $deck, $players, $board, $dead;

		$i = 2 * $players + 6;
		$dead[2] = $deck[$i];
		$board[4] = $deck[$i + 1]; // burn one

		// inject html to show river card
		echo '<img src="Cards/' . $board[4] . '.png" alt="'. $board[4] . '" class="river community">';

	}

	function bet() {

	}

	function endGame() {

		global $board, $dealt;
		//determine winner here
	}

	function payout() {
		// payout with house edge
	}
?>