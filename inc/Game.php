<?php
define("session.cookie_lifetime", 1800);
define("session.gc_maxlifetime", 1800);
class Game {
	// Generic globals
	private $kinds = array("2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A");
	private $suits = array("C", "D", "H", "S");
	private $iters = 100000;
	private $houseEdge = 1;

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
		
		// Session handling
		if (!isset($_SESSION['CREATED'])) {
			$_SESSION['CREATED'] = time();
		} else if (time() - $_SESSION['CREATED'] > 1800) {
			session_regenerate_id(true);
			$_SESSION['CREATED'] = time();
		}
		if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 1800)) {
			session_unset();
			session_destroy();
		}
		$_SESSION['LAST_ACTIVITY'] = time();

		if( !isset($_SESSION["user"]) ) die(json_encode(array("error" => "Please login.")));

		// Initialize variables
		$this->state = isset($_SESSION["state"]) ? $_SESSION["state"] : 0;
		$this->players = isset($_SESSION["players"]) ? $_SESSION["players"] : 0;
		$this->allowed = isset($_SESSION["allowed"]) ? $_SESSION["allowed"] : 0;
		$this->totalBet = isset($_SESSION["totalBet"]) ? $_SESSION["totalBet"] : 0;
		$this->gameid = isset($_SESSION["gameid"]) ? $_SESSION["gameid"] : -1;
		$this->deck = isset($_SESSION["deck"]) ? $_SESSION["deck"] : array();
		$this->hole = isset($_SESSION["hole"]) ? $_SESSION["hole"] : array();
		$this->board = isset($_SESSION["board"]) ? $_SESSION["board"] : array();
		$this->dead = isset($_SESSION["dead"]) ? $_SESSION["dead"] : array();
		$this->mults = isset($_SESSION["mults"]) ? $_SESSION["mults"] : array();
		$this->amounts = isset($_SESSION["amounts"]) ? $_SESSION["amounts"] : array();

		// Load global options
		$st = MySQL::query("SELECT `value` FROM `options` WHERE `key` = 'rake'", array());
		$st = $st->fetchAll();
		$this->houseEdge = floatval($st[0][0]);

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
			$this->totalBet = 0;
			$this->gameid = -1;
			$this->deck = array();
			$this->hole = array();
			$this->board = array();
			$this->dead = array();
			$this->mults = array();
			$this->amounts = array();

			// Start the game, deal hands etc
			$this->buildDeck();
			//$this->deck = array("2H", "7C", "3C", "8D", "2C", "QC","AS","KS","9D", "8S", "JD", "TH");
			$this->dealCards();

			$odds = $this->getOdds();
			$this->getMultipliers($odds);

			// Update DB
			$index = $this->getCurrentIndex();

			$hands = json_encode($this->hole);
			$board = json_encode(array($this->deck[1], $this->deck[2], $this->deck[3], $this->deck[5], $this->deck[7]));
			$dead = json_encode(array($this->deck[0], $this->deck[4], $this->deck[6]));
			MySQL::query("INSERT INTO `games` (`user`, `hands`, `board`, `dead`) VALUES (?, ?, ?, ?)",
				array($index, $hands, $board, $dead));
			$this->gameid = MySQL::getLastId();

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
			if( count($this->amounts) < 1 ) $this->amounts[] = array();
			$this->totalBet = $this->updateBets($this->amounts[$this->state - 1]);

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
			if( count($this->amounts) < 2 ) $this->amounts[] = array();
			$this->totalBet = $this->updateBets($this->amounts[$this->state - 1]);

			if($preFlopCount == 0)
				die(json(array("error" => "No bets made pre-flop.")));

			$this->turn();

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

			if( count($this->amounts) < 3 ) $this->amounts[] = array();
			$this->totalBet = $this->updateBets($this->amounts[$this->state - 1]);

			if($preFlopCount == 0)
				die(json(array("error" => "No bets made pre-flop.")));

			$this->river();

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
				$index = $this->getCurrentIndex();
				MySQL::query("INSERT INTO `transactions` (`user`, `type`, `amount`) VALUES (?, 0, ?)",
					array($index, $pay_out));
				MySQL::query("UPDATE `users` SET `balance` = `balance` + ? WHERE `index` = ?",
					array($pay_out, $index));
			}
			MySQL::query("UPDATE `games` SET `timeend` = NOW(), `amounts` = ? WHERE `index` = ?",
				array(json_encode($this->amounts), $this->gameid));

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

			// 3/31 Logic
			if( $this->state > 1 ){
				foreach($this->amounts as $amt){
					$sumOfBets += array_sum($amt); 
				}
				if( $totalBet > $sumOfBets ){
					die(json(array("error" => "Your bet must be less than the total pot.")));
				}
			} else {
				// Assert non-empty bets and available balance
				if( $totalBet <= 0 ){
					die(json(array("error" => "Your bet must be more than $0")));
				}
			}

			// Check balance
			$email = $_SESSION["user"];
			$q = MySQL::query("SELECT `index`, `balance` FROM `users` WHERE `email` = ?",
				array($email));
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
			if( $this->state < 2 && $betCount < 1 ){
				die(json(array("error" => "Your must bet on at least 1 hand.")));
			}

			$this->amounts[$this->state - 1] = $post["amounts"];
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
		$_SESSION["totalBet"] = $this->totalBet;
	}

	private function getCurrentIndex(){
		$email = $_SESSION["user"];
		$q = MySQL::query("SELECT `index` FROM `users` WHERE `email` = ?",
			array($email));
		$rows = $q->fetchAll();
		return $rows[0]["index"];
	}

	private function updateBets($arr){
		$totalBet = 0;
		foreach($arr as $amt){
			if($amt){
				if(!is_numeric($amt) || intval($amt) != $amt)
					die(json(array("error" => "Invalid bet amount: \$$amt")));
				if($amt < 0)
					die(json(array("error" => "You bet must be more than $0")));
				$totalBet += intval($amt);
			}
		}
		// Update DB
		if( $totalBet != 0 ){
			$index = $this->getCurrentIndex();
			MySQL::query("INSERT INTO `transactions` (`user`, `type`, `amount`) VALUES (?, ?, ?)",
				array($index, $this->state, -$totalBet));
			MySQL::query("UPDATE `users` SET `balance` = `balance` - ? WHERE `index` = ?",
				array($totalBet, $index));
			MySQL::query("UPDATE `games` SET `amounts` = ? WHERE `index` = ?",
				array(json_encode($this->amounts), $this->gameid));
		}

		return $totalBet;
	}

	private function buildDeck(){
		$deck = array();
		for($s = 0; $s < count($this->suits); $s++)
			for($k = 0; $k < count($this->kinds); $k++)
				$this->deck[$s * count($this->kinds) + $k] = $this->kinds[$k] . $this->suits[$s];
		shuffle($this->deck);
	}

	private function dealCards(){
		for($i = 0; $i < $this->players; $i++) {
			$this->hole[$i] = array(array_shift($this->deck));
		}
		for($i = 0; $i < $this->players; $i++) {
			$this->hole[$i][] = array_shift($this->deck);
			sort($this->hole[$i]);
		}
	}

	private function flop(){
		$this->dead[0] = array_shift($this->deck); 
		$this->board[0] = array_shift($this->deck); 
		$this->board[1] = array_shift($this->deck);
		$this->board[2] = array_shift($this->deck);
	}

	private function turn(){
		$this->dead[1] = array_shift($this->deck);
		$this->board[3] = array_shift($this->deck); 
	}

	private function river(){
		$this->dead[2] = array_shift($this->deck); 
		$this->board[4] = array_shift($this->deck); 
	}

	public function getOdds(){
		$result = pokenum(PN_TEXAS, $this->hole, $this->board, $this->dead);
		$wins = array();
		$ties = array();
		foreach($result["hands"] as $hand) {
			$wins[] = $hand["win"];
			$ties[] = $hand["tie"];
		}
		return array("wins" => $wins, "ties" => $ties, "total" => $result["iterations"]);
	}

	public function getMultipliers($odds){
		foreach($odds["wins"] as $k => $w)
			$this->mults[$this->state][] = $w == 0 ? 0 : floor(((($this->iters / ($w + $odds["ties"][$k]/2))) * $this->houseEdge) * 100) / 100;
	}

	public function getPlayers(){
		return ($this->players == 2 ? 2 : floor(($this->players - 1) / 2)) + 1;
	}
}