<?php
define("session.cookie_lifetime", 1800);
define("session.gc_maxlifetime", 1800);
class Game extends API {
	// Generic globals
	private $kinds = array("2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A");
	private $suits = array("C", "D", "H", "S");
	private $iters = 100000;
	private $houseEdge = 1;

	// Game variables
	private $state = 0;
	private $players = 0;
	private $allowed = 0;
	private $totalBet = 0;
	private $gameid = -1;
	private $deck = array();
	private $hole = array();
	private $board = array();
	private $dead = array();
	private $mults = array();
	private $amounts = array();
	private $DB;

	public function __construct(){
		global $f3;
		$this->DB = $f3->get("DB");

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
		$st = $this->DB->exec("SELECT `value` FROM `options` WHERE `key` = 'rake'");
		$this->houseEdge = floatval($st[0]["value"]);
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

	public function preFlop($e){
		if(!isset($_SESSION["user"]))
			die(self::json(array("error" => "Not logged in")));

		if($_POST["players"] < 2 || $_POST["players"] > 10)
			die(self::json(array("error" => "Invalid number of players.")));

		// New game started, reset all game variables
		$this->state = 0;
		$this->players = $_POST["players"];
		$this->allowed = 0;
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
		$this->dealCards();

		$odds = $this->getOdds();
		$this->getMultipliers($odds);

		// Update DB
		$index = $this->getCurrentIndex();

		$hands = json_encode($this->hole);
		$board = json_encode(array($this->deck[1], $this->deck[2], $this->deck[3], $this->deck[5], $this->deck[7]));
		$dead = json_encode(array($this->deck[0], $this->deck[4], $this->deck[6]));
		$this->DB->exec("INSERT INTO `games` (user, hands, board, dead) VALUES (?, ?, ?, ?)",
			array(1=>$index, 2=>$hands, 3=>$board, 4=>$dead));
		$this->gameid = $this->DB->lastInsertId();

		echo self::json(array(
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
	}

	public function flop($e){
		$blank = array(0, "", false, null);
		$preFlopCount = count(array_diff($this->amounts[0], $blank));
		if( count($this->amounts) < 1 ) $this->amounts[] = array();
		$this->totalBet = $this->updateBets($this->amounts[$this->state - 1]);

		if($preFlopCount == 0)
			die(self::json(array("error" => "No bets made pre-flop.")));

		$this->dead[0] = array_shift($this->deck); 
		$this->board[0] = array_shift($this->deck); 
		$this->board[1] = array_shift($this->deck);
		$this->board[2] = array_shift($this->deck);

		$odds = $this->getOdds();
		$this->getMultipliers($odds);

		echo self::json(array(
				"board" => $this->board,
				"dead" => $this->dead,
				"odds" => $odds,
				"mults" => $this->mults[$this->state]
			)
		);
		$this->state++;
	}

	public function turn($e){
		$blank = array(0, "", false, null);
		$preFlopCount = count(array_diff($this->amounts[0], $blank));

		if( count($this->amounts) < 2 )
			$this->amounts[] = array();
		$this->totalBet = $this->updateBets($this->amounts[$this->state - 1]);

		if($preFlopCount == 0)
			die(self::json(array("error" => "No bets made pre-flop.")));

		$this->dead[1] = array_shift($this->deck);
		$this->board[3] = array_shift($this->deck); 

		$odds = $this->getOdds();
		$this->getMultipliers($odds);

		echo self::json(array(
				"board" => array($this->board[3]),
				"dead" => array($this->dead[1]),
				"odds" => $odds,
				"mults" => $this->mults[$this->state]
			)
		);

		$this->state++;
	}

	public function river($e){
		$blank = array(0, "", false, null);
		$preFlopCount = count(array_diff($this->amounts[0], $blank));

		if( count($this->amounts) < 3 ) $this->amounts[] = array();
		$this->totalBet = $this->updateBets($this->amounts[$this->state - 1]);

		if($preFlopCount == 0)
			die(self::json(array("error" => "No bets made pre-flop.")));

		$this->dead[2] = array_shift($this->deck); 
		$this->board[4] = array_shift($this->deck); 

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
			$this->DB->exec("INSERT INTO `transactions` (`user`, `type`, `amount`) VALUES (?, 0, ?)",
				array(1=>$index, 2=>$pay_out));
			$this->DB->exec("UPDATE `users` SET `balance` = `balance` + ? WHERE `index` = ?",
				array(1=>$pay_out, 2=>$index));
		}
		$this->DB->exec("UPDATE `games` SET `timeend` = NOW(), `amounts` = ? WHERE `index` = ?",
			array(1=>json_encode($this->amounts), 2=>$this->gameid));

		echo self::json(array(
				"board" => array($this->board[4]),
				"dead" => array($this->dead[2]),
				"odds" => $ala->getOdds(),
				"mults" => $this->mults,
				"amounts" => $this->amounts,
				"payout" => $pay_out
			)
		);
	}

	public function bet($e){
		if(count($_POST["amounts"]) != $this->players){
			die(self::json(array("error" => "Invalid number of bets")));
		}

		$blank = array(0, "", false, null);
		$candidateAmounts = $_POST["amounts"];
		$totalBet = 0;
		$sumOfBets = 0;

		// Assert positive integers
		foreach($candidateAmounts as $amt){
			if($amt){
				if(!is_numeric($amt) || intval($amt) != $amt)
					die(self::json(array("error" => "Invalid bet amount: \$$amt")));
				if($amt < 0)
					die(self::json(array("error" => "You bet must be more than $0")));
				$totalBet += intval($amt);
			}
		}

		if( $this->state > 1 ){
			foreach($this->amounts as $amt){
				$sumOfBets += array_sum($amt); 
			}
			if( $totalBet > $sumOfBets ){
				die(self::json(array("error" => "Your bet must be less than the pot.")));
			}
		} else {
			if( $totalBet <= 0 ){
				die(self::json(array("error" => "Your bet must be more than $0")));
			}
		}

		// Check balance
		$email = $_SESSION["user"];
		$rows = $this->DB->exec("SELECT `index`, `balance` FROM `users` WHERE `email` = ?", $email);
		if( $totalBet > intval($rows[0]["balance"]) ){
			die(self::json(array("error" => "Your bet must be less than your balance")));
		}

		$betCount = count(array_diff($candidateAmounts, $blank));

		// Required to have 1 bet on pre-flop
		if( $betCount < 1 ){
			die(self::json(array("error" => "Your must bet on at least 1 hand.")));
		}

		$this->amounts[$this->state - 1] = $_POST["amounts"];
	}

	public function top10($e){
		Header("Access-Control-Allow-Origin: http://blog.alapoker.net");
		echo self::json(
			$this->DB->exec("SELECT `nickname`,`balance` FROM `users` WHERE
				`nickname` != 'New User' AND `balance` != 10000
				ORDER BY `balance` DESC LIMIT 0,10")->fetchAll(PDO::FETCH_NUM)
		);
	}

	private function getCurrentIndex(){
		$email = $_SESSION["user"];
		$rows = $this->DB->exec("SELECT `index` FROM `users` WHERE `email` = ?", $email);
		return $rows[0]["index"];
	}

	private function updateBets($arr){
		$totalBet = 0;
		foreach($arr as $amt){
			if($amt){
				if(!is_numeric($amt) || intval($amt) != $amt)
					die(self::json(array("error" => "Invalid bet amount: \$$amt")));
				if($amt < 0)
					die(self::json(array("error" => "You bet must be more than $0")));
				$totalBet += intval($amt);
			}
		}
		// Update DB
		if( $totalBet != 0 ){
			$index = $this->getCurrentIndex();
			$this->DB->exec("INSERT INTO `transactions` (`user`, `type`, `amount`) VALUES (?, ?, ?)",
				array(1=>$index, 2=>$this->state, 3=>-$totalBet));
			$this->DB->exec("UPDATE `users` SET `balance` = `balance` - ? WHERE `index` = ?",
				array(1=>$totalBet, 2=>$index));
			$this->DB->exec("UPDATE `games` SET `amounts` = ? WHERE `index` = ?",
				array(1=>json_encode($this->amounts), 2=>$this->gameid));
		}

		return $totalBet;
	}

	private function buildDeck(){
		$deck = array();
		for($s = 0; $s < count($this->suits); $s++)
			for($k = 0; $k < count($this->kinds); $k++)
				$this->deck[$s * count($this->kinds) + $k] = $this->kinds[$k] . $this->suits[$s];
	}

	private function dealCards(){
		shuffle($this->deck);
		for($i = 0; $i < $this->players; $i++) {
			$this->hole[$i] = array(array_shift($this->deck));
		}
		for($i = 0; $i < $this->players; $i++) {
			$this->hole[$i][] = array_shift($this->deck);
			sort($this->hole[$i]);
		}
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