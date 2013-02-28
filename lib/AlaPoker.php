<?php
/**
 * A la poker odds calculation
 *
 * @author     Sashank Tadepalli <dijjit@gmail.com>
 * @author     Mihir Sanghavi <mihir.h.sanghavi@gmail.com>
 * @copyright  2013 A la poker
 * @license    All rights reserved
 */

/**
 * Required library files
 */
require_once("Tables.php");
require_once("Hands.php");
require_once("Yield.php");

class AlaPoker {
	// Array of masks, each player
	private $hands = array();

	// Board cards mask
	private $board = 0;

	// Dead cards mask
	private $deads = 0;

	// Resulting arrays
	private $wins = array();
	private $ties = array();
	private $loss = array();
	private $totalHands = 0;

	/**
	 * Constructor will accept formatted strings and parse them into masks for future calculation.
	 */
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