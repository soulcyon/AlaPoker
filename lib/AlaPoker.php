<?php
require_once("Tables.php");
require_once("Hands.php");
require_once("Yield.php");
class AlaPoker {
	private $hands = array();
	private $board = 0;
	private $deads = 0;
	private $wins = array();
	private $ties = array();
	private $loss = array();
	private $totalHands = 0;

	public function __construct($hands, $board, $deads) {
<<<<<<< HEAD
		
		$this->hands = Hands::parse($hands, true);
		$this->board = Hands::parse($board);
		$this->deads = Hands::parse($deads);
	}

	public function getOdds() {
		
		$board_mask = Hands::mask_cards($board);
		$deads_mask = Hands::mask_cards($deads);

		var_dump($board_mask);
=======
		$this->board = Hands::parse($board);
		$this->deads = Hands::parse($deads);
		$this->hands = Hands::parse($hands, true);
		for($i = 0;$i < count($this->hands); $i++){
			$this->deads |= $this->hands[$i];
		}
	}

	public function getOdds() {
		var_dump(iterator_to_array(Yield::generate(intval($this->board), intval($this->deads), 5)));
		return $this->hands . ":" . $this->deads;
>>>>>>> Hopefully this shit dont conflict
	}
}
?>