<?php
error_reporting(E_ALL);
ini_set("display_errors", true);
	set_time_limit(0); 
	ignore_user_abort();
	require_once("db.php");
	require_once("AlaPoker.php");

	$st1 = MySQL::query("SELECT * FROM `transactions`", array());
	$st2 = MySQL::query("SELECT * FROM `games`", array());
	$gameData = $st2->fetchAll(PDO::FETCH_ASSOC);

	foreach($gameData as $k => $row){
		$hands = $gameData[$k]["hands"] = json_decode($row["hands"], true);
		$board = $gameData[$k]["board"] = json_decode($row["board"], true);
		$deads = $gameData[$k]["dead"] = json_decode($row["dead"], true);
		$bets = $gameData[$k]["amounts"] = json_decode($row["amounts"], true);

		// River
		$strhand = "";
		foreach($hands as $h){
			$strhand .= " " . implode(" ", $h);
		}
		$ala = new AlaPoker(substr($strhand, 1), implode(" ", $board), implode(" ", $deads));
		$t = $ala->getOdds();
		$gameData[$k]["riverOdds"] = array($t["wins"], $t["ties"]);

		array_pop($board);
		array_pop($deads);

		// Turn
		$result = pokenum(PN_TEXAS, $hands, $board, $deads);
		$wins = array();
		$ties = array();
		foreach($result["hands"] as $hand) {
			$wins[] = dropround($hand["win"], $result["iterations"]);
			$ties[] = dropround($hand["tie"], $result["iterations"]);
		}
		$gameData[$k]["turnOdds"] = array($wins, $ties);

		array_pop($board);
		array_pop($deads);

		// Flop
		$result = pokenum(PN_TEXAS, $hands, $board, $deads);
		$wins = array();
		$ties = array();
		foreach($result["hands"] as $hand) {
			$wins[] = dropround($hand["win"], $result["iterations"]);
			$ties[] = dropround($hand["tie"], $result["iterations"]);
		}
		$gameData[$k]["flopOdds"] = array($wins, $ties);

		// Pre-flop
		$result = pokenum(PN_TEXAS, $hands, array(), array());
		$wins = array();
		$ties = array();
		foreach($result["hands"] as $hand) {
			$wins[] = dropround($hand["win"], $result["iterations"]);
			$ties[] = dropround($hand["tie"], $result["iterations"]);
		}
		$gameData[$k]["preOdds"] = array($wins, $ties);
	}

	file_put_contents("transactions.json", json_encode($st1->fetchAll(PDO::FETCH_ASSOC)));
	file_put_contents("games.json", json_encode($gameData));

	echo "completed on " . date('m/d/y h:i:s');

    function dropround($i, $t){
    	return floor($i/$t * 10000)/100;
    }
?>
