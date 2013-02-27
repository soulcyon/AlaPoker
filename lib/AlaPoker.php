<?php

require_once("Hands.php");

class AlaPoker {
	
	private $hands = array();
	private $board = array();
	private $deads = array();
	private $wins = array();
	private $ties = array();
	private $loss = array();
	private $totalHands = 0;

	public function __construct($hands, $board, $deads) {
		$this->hands = Hands::parse($hands, "");
		$this->board = Hands::parse("", $board);
		$this->deads = Hands::parse("", $deads);
	}

	public function getOdds() {
		
		$board_mask = Hands::mask_cards($board);
		$deads_mask = Hands::mask_cards($deads);

	}
}

?>