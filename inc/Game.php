<?php
class Game {
	// Generic globals
	private $kinds = array("2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A");
	private $suits = array("C", "D", "H", "S");
	private $iters = 100000;
	private $houseEdge = 0.97;

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
		$this->db = new PDO("mysql:host=localhost;dbname=alapoker", DB_USER, DB_PASS);
		$this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		ini_set("pokenum.iterations", $this->iters);

		if( !isset($_SESSION["user"]) ) die(json_encode(array("error" => "Please login.")));

		$this->state = isset($_SESSION["state"]) ? $_SESSION["state"] : 0;
		$this->players = isset($_SESSION["players"]) ? $_SESSION["players"] : 0;
		$this->allowed = isset($_SESSION["allowed"]) ? $_SESSION["allowed"] : 0;
		$this->gameid = isset($_SESSION["gameid"]) ? $_SESSION["gameid"] : -1;
		$this->deck = isset($_SESSION["deck"]) ? $_SESSION["deck"] : array();
		$this->hole = isset($_SESSION["hole"]) ? $_SESSION["hole"] : array();
		$this->board = isset($_SESSION["board"]) ? $_SESSION["board"] : array();
		$this->dead = isset($_SESSION["dead"]) ? $_SESSION["dead"] : array();
		$this->mults = isset($_SESSION["mults"]) ? $_SESSION["mults"] : array();
		$this->amounts = isset($_SESSION["amounts"]) ? $_SESSION["amounts"] : array();

		/**
		* Pre-flop
		**/
		$this->pushHandle("pre-flop", function($post){
			if(!isset($_SESSION["user"]))
				die(json(array("error" => "Not logged in")));

			if($post["players"] < 2 || $post["players"] > 10)
				die(json(array("error" => "Invalid number of players.")));

			// New game started, reset all game variables
			$this->state = 0;
			$this->players = $post["players"];
			$this->allowed = 0/*$this->getPlayers($this->players)*/;
			$this->gameid = -1;
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

			// Update DB
			$email = $_SESSION["user"];
			$q = $this->db->query("SELECT `index` FROM `users` WHERE `email` = '$email'");
			$rows = $q->fetchAll();
			$index = $rows[0]["index"];

			$hands = json_encode($this->hole);
			$board = json_encode(array($this->deck[1], $this->deck[2], $this->deck[3], $this->deck[5], $this->deck[7]));
			$dead = json_encode(array($this->deck[0], $this->deck[4], $this->deck[6]));
			$this->db->query("INSERT INTO `games` (`user`, `hands`, `board`, `dead`) VALUES ($index, '$hands', '$board', '$dead')");
			$this->gameid = $this->db->lastInsertId();

			echo json(array(
					"hole" => $this->hole,
					"odds" => $odds,
					"mults" => $this->mults[$this->state],
					"board" => $board,
					"dead" => $dead,
					"hands" => $hands,
					"user" => $index
				)
			);

			$this->state++;
		});

		/**
		* Flop
		**/
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

		/**
		* Turn
		**/
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

		/**
		* River
		**/
		$this->pushHandle("river", function(){
			$blank = array(0, "", false, null);
			$preFlopCount = count(array_diff($this->amounts[0], $blank));

			if($preFlopCount == 0)
				die(json(array("error" => "No bets made pre-flop.")));

			$this->river();

			if( count($this->amounts) == 2 ){
				$this->amounts[] = array();
			}

			// Odds calculation
			require_once("inc/AlaPoker.php");
			$this->hands = "";
			foreach($this->hole as $h){
				$this->hands .= " " . implode(" ", $h);
			}
			$ala = new AlaPoker(substr($this->hands, 1), implode(" ", $this->board), implode(" ", $this->dead));
			$odds = $ala->getOdds();

			// Payout calculation
			$pay_out = 0.0;
			for($i = 0; $i < count($odds["wins"]); $i++){
				if( floor($odds["wins"][$i]) != 0 ){
					for($j = 0; $j < 3; $j++){
						if( isset($this->amounts[$j]) && isset($this->amounts[$j][$i]) ){
							$pay_out += floor($this->amounts[$j][$i] * $this->mults[$j][$i]);
						}
					}
				}
				if( floor($odds["ties"][$i]) != 0 ){
					for($j = 0; $j < 3; $j++){
						if( isset($this->amounts[$j]) && isset($this->amounts[$j][$i]) ){
							$pay_out += floor($this->amounts[$j][$i]);
						}
					}
				}
			}

			// DB Update
			if($pay_out > 0){
				$email = $_SESSION["user"];
				$q = $this->db->query("SELECT `index` FROM `users` WHERE `email` = '$email'");
				$rows = $q->fetchAll();
				$index = $rows[0]["index"];
				$this->db->query("INSERT INTO `transactions` (`user`, `type`, `amount`) VALUES ($index, 0, $pay_out)");
				$this->db->query("UPDATE `users` SET `balance` = `balance` + $pay_out WHERE `index` = $index");
			}
			$this->db->query("UPDATE `games` SET `timeend` = NOW() WHERE `index` = $this->gameid");

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

		/**
		* Bet
		**/
		$this->pushHandle("bet", function($post){
			if(count($post["amounts"]) != $this->players){
				die(json(array("error" => "Invalid number of bets")));
			}
			
			$blank = array(0, "", false, null);
			$candidateAmounts = $post["amounts"];
			$totalBet = 0;
			$sumOfBets = 0;

			// Assert positive integers
			foreach($candidateAmounts as $amt){
				if($amt){
					if(!is_numeric($amt) || intval($amt) != $amt)
						die(json(array("error" => "Invalid bet amount: \$$amt")));
					if($amt < 0)
						die(json(array("error" => "You bet must be more than $0")));
					$totalBet += intval($amt);
				}
			}

			// Assert non-empty bets and available balance
			if( $totalBet <= 0 ){
				die(json(array("error" => "Your bet must be more than $0")));
			}

			// 3/31 Logic
			if( $this->state > 1 ){
				foreach($this->amounts as $amt){
					$sumOfBets += array_sum($amt); 
				}
				if( $totalBet > $sumOfBets ){
					die(json(array("error" => "Your bet must be less than the pot.")));
				}
			}

			// Check balance
			$email = $_SESSION["user"];
			$q = $this->db->query("SELECT `index`, `balance` FROM `users` WHERE `email` = '$email'");
			$rows = $q->fetchAll();
			if( $totalBet > intval($rows[0]["balance"]) ){
				die(json(array("error" => "Your bet must be less than your balance")));
			}

			$betCount = count(array_diff($candidateAmounts, $blank));

			/* 3/27 Logic
			$this->allowed = ($this->state == 1) ? $betCount : $this->allowed;

			if($this->allowed <= 0 || $betCount > $this->allowed)
				die(json(array("error" => "You've exhauted your allowed number of bets")));*/

			// Required to have 1 bet on pre-flop
			if( $betCount >= 1 ){
				if( $this->state >= 0 ){
					// Update DB
					$index = intval($rows[0]["index"]);
					$this->db->query("INSERT INTO `transactions` (`user`, `type`, `amount`) VALUES ($index, $this->state, -$totalBet)");
					$this->db->query("UPDATE `users` SET `balance` = `balance` - $totalBet WHERE `index` = $index");

					// Update game variables
					$this->amounts[$this->state - 1] = $post["amounts"];

					// 3/27 Logic
					//$this->allowed -= $betCount;
				}
			} else {
				die(json(array("error" => "Your must bet on at least 1 hand.")));
			}
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
		$_SESSION["gameid"] = $this->gameid;
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
			$this->hole[$i] = array(array_shift($this->deck));
		}
		for($i = 0; $i < $this->players; $i++) {
			$this->hole[$i][] = array_shift($this->deck);
			sort($this->hole[$i]);
		}
	}

	private function flop() {
		$this->dead[0] = array_shift($this->deck); 
		$this->board[0] = array_shift($this->deck); 
		$this->board[1] = array_shift($this->deck);
		$this->board[2] = array_shift($this->deck);
	}

	private function turn() {
		$this->dead[1] = array_shift($this->deck);
		$this->board[3] = array_shift($this->deck); 
	}

	private function river() {
		$this->dead[2] = array_shift($this->deck); 
		$this->board[4] = array_shift($this->deck); 
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
		return ($this->players == 2 ? 2 : floor(($this->players - 1) / 2)) + 1;
	}
}