<?php
	Header("Content-type: application/json");
	error_reporting(E_ALL);
	$iters = 100000;
	$houseEdge = 1.0; // 0.95, 0.90 etc
	ini_set("pokenum.iterations", $iters);
	ini_set("display_errors", true);
	session_start();

	// state: 0 - pre-flop, 1 - flop, 2 - turn, 3 - river
	$state = isset($_SESSION['state']) ? $_SESSION['state'] : 0;
	$players = isset($_SESSION['players']) ? $_SESSION['players'] : 0;
	$allowed = isset($_SESSION['allowed']) ? $_SESSION['allowed'] : 0;
	$deck = isset($_SESSION['deck']) ? $_SESSION['deck'] : array();
	$hole = isset($_SESSION['hole']) ? $_SESSION['hole'] : array();
	$board = isset($_SESSION['board']) ? $_SESSION['board'] : array();
	$dead = isset($_SESSION['dead']) ? $_SESSION['dead'] : array();
	$mults = isset($_SESSION['mults']) ? $_SESSION['mults'] : array();
	$amounts = isset($_SESSION['mults']) ? $_SESSION['mults'] : array();

	if($_POST['type'] == 'pre-flop' && isset($_POST['players'])) {

		if($_POST['players'] < 2 || $_POST['players'] > 10)
			die(json_encode(array("error" => "Invalid number of players to deal.")));

		$state = 0;
		$players = $_POST['players'];
		$allowed = allowed($players);
		$deck = $hole = $board = $dead = $mults = $amounts = array();

		$kinds = array("2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"); // T - 10
		$suits = array("C", "D", "H", "S"); // clubs, diamonds, hearts, spades
	
		buildDeck($deck, $kinds, $suits);
		dealCards($hole, $players, $deck);

		$odds = getOddsMonteCarlo($hole, $board, $dead);
		getMults($mults, $odds, $state);

		echo json_encode(array('hole' => $hole, 'odds' => $odds, 'mults' => $mults[$state]));

		$state++;
	}

	if($_POST['type'] == 'flop' && $state == 1) {

		$blank = array(0, "", false, null);
		$preFlopCount = count(array_diff($amounts[0], $blank));

		if($preFlopCount == 0)
			die(json_encode(array("error" => "-5")));
		
		flop($deck, $players, $board, $dead);

		$odds = getOddsMonteCarlo($hole, $board, $dead);
		getMults($mults, $odds, $state);

		echo json_encode(array("board" => $board, "dead" => $dead, 'odds' => $odds, 'mults' => $mults[$state]));

		$state++;
	}

	if($_POST['type'] == 'turn' && $state == 2) {

		$blank = array(0, "", false, null);
		$preFlopCount = count(array_diff($amounts[0], $blank));

		if($preFlopCount == 0)
			die(json_encode(array("error" => "-5")));

		turn($deck, $players, $board, $dead);

		$odds = getOddsMonteCarlo($hole, $board, $dead);
		getMults($mults, $odds, $state);

		echo json_encode(array("board" => array($board[3]), "dead" => array($dead[1]),  'odds' => $odds, 'mults' => $mults[$state]));

		$state++;
	}

	if($_POST['type'] == 'river' && $state == 3) {

		$blank = array(0, "", false, null);
		$preFlopCount = count(array_diff($amounts[0], $blank));

		if($preFlopCount == 0)
			die(json_encode(array("error" => "-5")));

		river($deck, $players, $board, $dead);
		require_once("inc/AlaPoker.php");
		$hands = "";
		foreach($hole as $h){
			$hands .= " " . implode(" ", $h);
		}
		$ala = new AlaPoker(substr($hands, 1), implode(" ", $board), implode(" ", $dead));
		echo json_encode(array("board" => array($board[4]), "dead" => array($dead[2]), "odds" => $ala->getOdds()));
	}

	if($_POST['type'] == 'bet' && isset($_POST['amounts'])) {

		if(count($_POST["amounts"]) != $players){
			Header("Status: 505");
			die(json_encode(array("error" => "-1")));
		}
		
		$blank = array(0, "", false, null);
		$candidateAmounts = $_POST['amounts'];

		foreach($candidateAmounts as $amt)
			if($amt && !is_numeric($amt)){
				Header("Status: 505");
				die(json_encode(array("error" => "-10")));
			}

		$betCount = count(array_diff($candidateAmounts, $blank));

		if($allowed <= 0 || $betCount > $allowed) {
			Header("Status: 505");
			die(json_encode(array("error" => "-9")));
		}
		
		// must have 1 pre-flop bet on any number of hands 
		if($state == 0 && $betCount >= 1 && $betCount <= $allowed) {
			$amounts[$state] = $_POST['amounts'];
			$allowed -= $betCount;
		}

		// use remaining bets however
		if($state > 0 && $betCount >= 1 && $betCount <= $allowed) {
			$amounts[$state] = $_POST['amounts'];
			$allowed -= $betCount;
		}
	}


	if($_POST['type'] == 'history') {
		return json_encode($amounts);
	}

	if($_POST['type'] == 'pay-out' && $state == 3) {

	}

	$_SESSION['players'] = $players;
	$_SESSION['deck'] = $deck;
	$_SESSION['hole'] = $hole;
	$_SESSION['board'] = $board;
	$_SESSION['dead'] = $dead;
	$_SESSION['state'] = $state;
	$_SESSION['mults'] = $mults;
	$_SESSION['amounts'] = $amounts;
	$_SESSION['allowed'] = $allowed;

	function buildDeck(&$deck, $kinds, $suits) {

		$deck = array();

		for($s = 0; $s < count($suits); $s++)
			for($k = 0; $k < count($kinds); $k++)
				$deck[$s * count($kinds) + $k] = $kinds[$k] . $suits[$s];
	}

	function dealCards(&$hole, $players, &$deck) {
		
		shuffle($deck);

		// players dealt here
		for($i = 0; $i < $players; $i++) {
			$hole[$i] = bubbleUp($deck[$i], $deck[$i + $players]);
		}
	}

	function flop($deck, $players, &$board, &$dead) {
		
		$i = 2 * $players;
		$dead[0] = $deck[$i]; 
		$board[0] = $deck[$i + 1]; 
		$board[1] = $deck[$i + 2];
		$board[2] = $deck[$i + 3];

	}

	function turn($deck, $players, &$board, &$dead) {
		
		$i = 2 * $players + 4;
		$dead[1] = $deck[$i];
		$board[3] = $deck[$i + 1]; 

	}

	function river($deck, $players, &$board, &$dead) {
		
		$i = 2 * $players + 6;
		$dead[2] = $deck[$i]; 
		$board[4] = $deck[$i + 1]; 

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

	function getOddsMonteCarlo($hole, $board, $dead) {

		$result = pokenum(PN_TEXAS, $hole, $board, $dead);
		$wins = array();
		$ties = array();
		foreach($result["hands"] as $hand) {
			$wins[] = $hand["win"];
			$ties[] = $hand["tie"];
		}
		return array("wins" => $wins, "ties" => $ties, "total" => $result["iterations"]);
	}

	function getMults(&$mults, $odds, $state) {

		global $houseEdge, $iters;
		
		foreach($odds['wins'] as $w)
			$mults[$state][] = $w == 0 ? 0 : floor($iters / $w * 10000) * $houseEdge / 10000;
	}

	function allowed($players) {

		return ($players == 2 ? 0 : floor(($players - 3) / 2)) + 1;
	}

	function payout() {
		
	}

?>