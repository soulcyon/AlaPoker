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
		$this->hands = Hands::parse($hands, true);
		$this->board = Hands::parse($board);
		$this->deads = Hands::parse($deads);
		for($i = 0;$i < count($this->hands); $i++){
			$this->deads |= $this->hands[$i];
		}
	}
	public function getOdds() {
		var_dump(iterator_to_array(Yield::generate(intval($this->board), intval($this->deads), 5)));
		return $this->hands . ":" . $this->deads;
	}
}
?>