<?php
require_once("Hands.php");
class AlaPoker {
	private $hands = array();
	private $board = array();
	private $deads = array();
	private $totalHands = 0;
	private $wins = array();
	private $ties = array();
	private $loss = array();

	public function __construct($hands, $board, $deads){
		$this->hands = Hands::parse($hands);
		$this->board = Hands::parse($board);
		$this->deads = Hands::parse($deads);
	}

	public function getOdds(){
		return $this->hands;
	}
}
?>