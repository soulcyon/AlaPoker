<?php
require_once "db.php";
function query($st){
	$db = new PDO("mysql:host=localhost;dbname=alapoker", DB_USER, DB_PASS);
	return $db->query($st);
}
class Game {
	// Generic globals
	private $kinds = array("2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A");
	private $suits = array("C", "D", "H", "S");
	private $iters = 100000;
	private $houseEdge = 1.0;

	// Game variables
	private $state = 0;
	private $players = 0;
	private $allowed = 0;
	private $deck = array();
	private $hole = array();
	private $board = array();
	private $dead = array();
	private $mults = array();
	private $amounts = array();
	private $handles = array();

	private function pushHandle($type, $fn){
		$this->handles[$type] = $fn;
	}

	public function __construct($type, $post){
		ini_set("pokenum.iterations", $this->iters);
		session_start();

		$this->state = isset($_SESSION["state"]) ? $_SESSION["state"] : 0;
		$this->players = isset($_SESSION["players"]) ? $_SESSION["players"] : 0;
		$this->allowed = isset($_SESSION["allowed"]) ? $_SESSION["allowed"] : 0;
		$this->deck = isset($_SESSION["deck"]) ? $_SESSION["deck"] : array();
		$this->hole = isset($_SESSION["hole"]) ? $_SESSION["hole"] : array();
		$this->board = isset($_SESSION["board"]) ? $_SESSION["board"] : array();
		$this->dead = isset($_SESSION["dead"]) ? $_SESSION["dead"] : array();
		$this->mults = isset($_SESSION["mults"]) ? $_SESSION["mults"] : array();
		$this->amounts = isset($_SESSION["amounts"]) ? $_SESSION["amounts"] : array();

		$this->pushHandle("pre-flop", function($post){
			if($post["players"] < 2 || $post["players"] > 10)
				die(json(array("error" => "Invalid number of players.")));

			// New game started, reset all game variables
			$this->state = 0;
			$this->players = $post["players"];
			$this->allowed = $this->getPlayers($this->players);
			$this->deck = array();
			$this->hole = array();
			$this->board = array();
			$this->dead = array();
			$this->mults = array();
			$this->amounts = array();

			// Start the game, deal hands etc
			$this->buildDeck();
			$this->dealCards();

			$odds = $this->getOdds();
			$this->getMultipliers($odds);

			echo json(array(
					"hole" => $this->hole,
					"odds" => $odds,
					"mults" => $this->mults[$this->state]
				)
			);

			$this->state++;
		});
		$this->pushHandle("flop", function(){
			$blank = array(0, "", false, null);
			$preFlopCount = count(array_diff($this->amounts[0], $blank));

			if($preFlopCount == 0)
				die(json(array("error" => "No bets made pre-flop.")));
			
			$this->flop();

			$odds = $this->getOdds();
			$this->getMultipliers($odds);

			echo json(array(
					"board" => $this->board,
					"dead" => $this->dead,
					"odds" => $odds,
					"mults" => $this->mults[$this->state]
				)
			);
			$this->state++;
		});
		$this->pushHandle("turn", function(){
			$blank = array(0, "", false, null);
			$preFlopCount = count(array_diff($this->amounts[0], $blank));

			if($preFlopCount == 0)
				die(json(array("error" => "No bets made pre-flop.")));

			$this->turn();

			if( count($this->amounts) == 1 ){
				$this->amounts[] = array();
			}

			$odds = $this->getOdds();
			$this->getMultipliers($odds);

			echo json(array(
					"board" => array($this->board[3]),
					"dead" => array($this->dead[1]),
					"odds" => $odds,
					"mults" => $this->mults[$this->state]
				)
			);

			$this->state++;
		});
		$this->pushHandle("river", function(){
			global $db;

			$blank = array(0, "", false, null);
			$preFlopCount = count(array_diff($this->amounts[0], $blank));

			if($preFlopCount == 0)
				die(json(array("error" => "No bets made pre-flop.")));

			$this->river();

			if( count($this->amounts) == 2 ){
				$this->amounts[] = array();
			}

			// Win calculation
			require_once("inc/AlaPoker.php");
			$this->hands = "";
			foreach($this->hole as $h){
				$this->hands .= " " . implode(" ", $h);
			}
			$ala = new AlaPoker(substr($this->hands, 1), implode(" ", $this->board), implode(" ", $this->dead));
			$odds = $ala->getOdds();

			// Payout
			$pay_out = 0;
			for($i = 0; $i < count($odds["wins"]); $i++){
				if( floor($odds["wins"][$i]) != 0 ){
					for($j = 0; $j < 3; $j++){
						if( isset($this->amounts[$j]) && isset($this->amounts[$j][$i]) ){
							$pay_out += $this->amounts[$j][$i] * $this->mults[$j][$i];
						}
					}
				}
			}

			// DB Push
			$email = $_SESSION["user"];
			query("UPDATE `users` SET `balance` = `balance` + $pay_out WHERE `username` = '$email'");

			echo json(array(
					"board" => array($this->board[4]),
					"dead" => array($this->dead[2]),
					"odds" => $ala->getOdds(),
					"mults" => $this->mults,
					"amounts" => $this->amounts,
					"payout" => $pay_out
				)
			);
		});
		$this->pushHandle("bet", function($post){
			global $db;

			if(count($post["amounts"]) != $this->players){
				die(json(array("error" => "Invalid number of bets.")));
			}
			
			$blank = array(0, "", false, null);
			$email = $_SESSION["user"];
			$candidateAmounts = $post["amounts"];
			$totalBet = 0;

			// Assert positive integers
			foreach($candidateAmounts as $amt)
				if($amt && is_numeric($amt)){
					if($amt < 0)
						die(json(array("error" => "Invalid bet amount.")));
					$totalBet += intval($amt);
				}

			$q = query("SELECT `balance` FROM `users` WHERE `username` = '$email'");
			$rows = $q->fetchAll();
			
			// Assert non-empty bets and available balance
			if( $totalBet === 0 || $totalBet > intval($rows[0][0]) ){
				die(json(array("error" => "Invalid bet amount.")));
			}

			$betCount = count(array_diff($candidateAmounts, $blank));

			if($this->allowed <= 0 || $betCount > $this->allowed)
				die(json(array("error" => "Too many bets.")));

			// Required to have 1 bet on pre-flop
			if( $betCount >= 1 && $betCount <= $this->allowed ){
				if( $this->state >= 0 ){
					// Update DB
					query("UPDATE `users` SET `balance` = `balance` - $totalBet WHERE `username` = '$email'");

					// Update game variables
					$this->amounts[$this->state - 1] = $post["amounts"];
					$this->allowed -= $betCount;
				}
			}
			var_dump($this->amounts);
		});

		$this->handles[$type]($post);
	}

	public function __destruct(){
		$_SESSION["players"] = $this->players;
		$_SESSION["deck"] = $this->deck;
		$_SESSION["hole"] = $this->hole;
		$_SESSION["board"] = $this->board;
		$_SESSION["dead"] = $this->dead;
		$_SESSION["state"] = $this->state;
		$_SESSION["mults"] = $this->mults;
		$_SESSION["amounts"] = $this->amounts;
		$_SESSION["allowed"] = $this->allowed;
	}

	private function buildDeck() {
		$deck = array();
		for($s = 0; $s < count($this->suits); $s++)
			for($k = 0; $k < count($this->kinds); $k++)
				$this->deck[$s * count($this->kinds) + $k] = $this->kinds[$k] . $this->suits[$s];
	}

	private function dealCards() {
		shuffle($this->deck);
		for($i = 0; $i < $this->players; $i++) {
			$c1 = $this->deck[$i];
			$c2 = $this->deck[$i + $this->players];

			$k1 = array_search($c1{0}, $this->kinds);
			$k2 = array_search($c2{0}, $this->kinds);

			if($k1 > $k2) {
				$this->hole[$i] = array($c1, $c2);
			} else if($k1 < $k2) {
				$this->hole[$i] = array($c2, $c1);
			} else {
				$s1 = array_search($c1{1}, $this->suits);
				$s2 = array_search($c2{1}, $this->suits);
				
				if($s1 > $s2) {
					$this->hole[$i] = array($c1, $c2);
				}
				else if($s1 < $s2) {
					$this->hole[$i] = array($c2, $c1);
				}
			}
		}
	}

	private function flop() {
		$i = 2 * $this->players;
		$this->dead[0] = $this->deck[$i]; 
		$this->board[0] = $this->deck[$i + 1]; 
		$this->board[1] = $this->deck[$i + 2];
		$this->board[2] = $this->deck[$i + 3];
	}

	private function turn() {
		$i = 2 * $this->players + 4;
		$this->dead[1] = $this->deck[$i];
		$this->board[3] = $this->deck[$i + 1]; 
	}

	private function river() {
		$i = 2 * $this->players + 6;
		$this->dead[2] = $this->deck[$i]; 
		$this->board[4] = $this->deck[$i + 1]; 
	}

	public function getOdds() {
		$result = pokenum(PN_TEXAS, $this->hole, $this->board, $this->dead);
		$wins = array();
		$ties = array();
		foreach($result["hands"] as $hand) {
			$wins[] = $hand["win"];
			$ties[] = $hand["tie"];
		}
		return array("wins" => $wins, "ties" => $ties, "total" => $result["iterations"]);
	}

	public function getMultipliers($odds) {
		foreach($odds["wins"] as $w)
			$this->mults[$this->state][] = $w == 0 ? 0 : floor($this->iters / $w * 10000) * $this->houseEdge / 10000;
	}

	public function getPlayers() {
		return ($this->players == 2 ? 0 : floor(($this->players - 3) / 2)) + 1;
	}

	public function payout() {
		
	}
}