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
		/*
		var_dump(iterator_to_array(Yield::generate(intval($this->board), intval($this->deads), 5)));
		return $this->hands . ":" . $this->deads;
		*/

        $totalhands = 0;
		foreach (Yield::generate(intval($this->board), intval($this->deads), 5) as $boardhand)
        {
            // Evaluate all hands and determine the best hand
            $bestpocket = Evaluate($pocketmasks[0] | $boardhand, 7);
            $pockethands[0] = $bestpocket;
            $bestcount = 1;
            for ($i = 1; $i < count($pockets); $i++)
            {
                $pockethands[$i] = Evaluate($pocketmasks[$i] | $boardhand, 7);
                if ($pockethands[$i] > $bestpocket)
                {
                    $bestpocket = $pockethands[$i];
                    $bestcount = 1;
                }
                else if ($pockethands[$i] == $bestpocket)
                {
                    $bestcount++;
                }
            }

            // Calculate $wins/$ties/loses for each pocket + board combination.
            for ($i = 0; $i < count($pockets); $i++)
            {
                if ($pockethands[$i] == $bestpocket)
                {
                    if ($bestcount > 1)
                    {
                        $ties[$i]++;
                    }
                    else
                    {
                        $wins[$i]++;
                    }
                }
                else if ($pockethands[$i] < $bestpocket)
                {
                    $losses[$i]++;
                }
            }

            $totalHands++;
        }

        // Odds of winning as a percentage for each player
        $odds = array();
        if ($totalhands != 0)
        {   
            for ($i = 0; $i < count($pockets); $i++) {
                $odds[$i] = ($wins[$i] + $ties[$i]) / 2.0 / $totalhands;
            }
        }
        return $odds;
	}
}
?>